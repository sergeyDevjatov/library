module.exports = function (server, sessionStore, cookieParser) {
    const user = require('./user.js');
    const _ = require('underscore');
    const crypto = require('crypto');
    const db = require('./connect.js')();
    const io = require('socket.io')(server);
    const SessionSocket = require('session.socket.io');
    const sessionIo = new SessionSocket(io, sessionStore, cookieParser);

    sessionIo.on('connection', function onConnect(err, socket, session) {
        if(typeof session === 'undefined'){
            socket.emit('connection-fail');
            return;
        }
        socket.emit('session', {sid: session.sid, login: session.login});

        socket.on('auth.sign_in', function onAuthSignIn(data) {
            db.User.find({login: data.login}, function onFind(err, users) {
                let isCorrectLoginPassPair = _.find(users, function onFind(self){
                    return self.password === user.hash(data.password, self.salt);
                });

                if (isCorrectLoginPassPair) {
                    session.sid = crypto.randomBytes(16).toString('hex');
                    session.login = data.login;
                    session.save();
                    socket.emit('auth.sign_in-success', {sid: session.sid});
                    socket.emit('session', {sid: session.sid, login: session.login});
                }
                else
                    socket.emit('auth.sign_in-fail', 'NotExists');
            });
        });

        socket.on('auth.sign_up', function onAuthSignUp(data) {
            db.User.find({login: data.login}, function onFind(err, users) {
                if (_.isEmpty(users)) {
                    admin = new db.User(user.create(data.login, data.password));
                    admin.save(function onSave(err) {
                        if (!err) {
                            session.sid = crypto.randomBytes(16).toString('hex');
                            session.login = data.login;
                            session.save();
                            socket.emit('auth.sign_up-success', {sid: session.sid});
                            socket.emit('session', {sid: session.sid, login: session.login});
                        }
                        else
                            socket.emit('auth.sign_up-fail');
                    });
                }
                else
                    socket.emit('auth.sign_up-fail', 'AlreadyExists');
            });
        });

        socket.on('auth.sign_out', function onAuthSignOut(data) {
            session.sid = session.login = null;
            session.save();
            socket.emit('auth.sign_out-success');
            socket.emit('session', {sid: session.sid, login: session.login});
        });


        // Filter data in case when from db was got unexpected fields
        // (just some security)
        function bookFilter(book){
            return book ? {
                id: book._id,
                title: book.title,
                author: authorFilter(book.author),
                genre: genreFilter(book.genre),
                isOrder: book.isOrder,
                orderByUser: book.orderByUser,
            } : null;
        }

        function authorFilter(author) {
            return author ? {
                id: author._id,
                name: author.name,
                born: author.bornFormatted,
                dead: author.deadFormatted
            } : null;
        }

        function genreFilter(genre) {
            return genre ? {
                id: genre._id,
                name: genre.name
            } : null;
        }

        function orderFilter(order) {
            return order ? {
                id: order._id,
                receivingDate: order.receivingDateFormatted,
                returningDate: order.returningDateFormatted,
                user: order.user,
                book: bookFilter(order.book)
            } : null;
        }

        // add handlers to database entities using mechanic like reflection
        _.each([
            //{model: db.Book, requestNamespace: 'books', filter: bookFilter},
            {model: db.Genre, requestNamespace: 'genres', filter: genreFilter},
            {model: db.Author, requestNamespace: 'authors', filter: authorFilter},
            {model: db.Order, requestNamespace: 'orders', filter: orderFilter},
        ], function addHandler(entity){
            socket.on(entity.requestNamespace + '.getAll', function onGetAllDataRequest(data){
                entity.model.find(null, function onFind(err, elements){
                    if(!err) {
                        socket.emit(entity.requestNamespace + '.getAll-success', _.map(elements, entity.filter));
                    }
                    else {
                        socket.emit(entity.requestNamespace + '.getAll-fail', err);
                    }
                });
            });
        });


        socket.on('books.getAll', function onGetAllBooksRequest(data){
            db.Book.find().populate('order').exec(function onFind(err, books){
                if(!err) {
                    socket.emit('books.getAll-success', _.map(books, function filter(book){
                        book.isOrder = book.order !== null && typeof book.order !== 'undefined';
                        if(book.isOrder) {
                            book.orderByUser = session.login !== null && book.order.user === session.login;
                        }
                        return bookFilter(book);
                    }));
                }
                else {
                    socket.emit(entity.requestNamespace + '.getAll-fail', err);
                }
            });
        });

        function addBook(author, genre){
            if(author && genre) {
                let book = new db.Book({
                    title: data.title,
                    author,
                    genre
                });
                book.save(function onSave(err) {
                    if (!err) {
                        socket.emit('books.add-success', {id: book.id});
                    }
                    else
                        socket.emit('books.add-fail', err);
                });
            }
            else
                socket.emit('books.add-fail', 'Incorrect author or genre');
        }

        socket.on('books.add', function onAddBook(data){
            db.Author.findOne({_id: data.authorId}, function onFindAuthor(err, foundAuthor){
                db.Genre.findOne({_id: data.genreId}, function onFindGenre(err, foundGenre){
                    addBook(foundAuthor, foundGenre)
                });
            });
        });

        socket.on('authors.add', function onAddAuthor(data){
            let author = new db.Author({
                name: data.name,
                born: data.born,
                dead: data.dead
            });
            author.save(function onSave(err) {
                if (!err) {
                    socket.emit('authors.add-success', {id: author.id});
                }
                else
                    socket.emit('authors.add-fail', err);
            });
        });

        socket.on('genres.add', function onAddGenre(data){
            let genre = new db.Genre({
                name: data.name
            });
            genre.save(function onSave(err) {
                if (!err) {
                    socket.emit('genres.add-success', {id: genre.id});
                }
                else
                    socket.emit('genres.add-fail', err);
            });
        });

        socket.on('orders.add', function onAddOrder(data){
            let order = new db.Order({
                returningDate: data.returningDate,
                user: session.login
            });
            if(session.login) {
                order.save(function onSave(err) {
                    if (!err)
                        db.User.findOneAndUpdate({login: session.login}, {$push: {orders: order._id}}, null, onUserUpdate);
                    else
                        socket.emit('orders.add-fail', err);
                });
            }
            else{
                socket.emit('orders.add-fail', {message: 'Not authorized error', code: 'NOAUTH'});
            }

            function onUserUpdate(err, user) {
                if (!err) {
                    db.Book.findOneAndUpdate({_id: data.bookId}, {order: order._id}, null, onBookUpdate);
                }
                else
                    socket.emit('orders.add-fail', err);
            }

            function onBookUpdate(err, book){
                if (!err){
                    order.book = book;
                    order.save();
                    socket.emit('orders.add-success', {id: order.id});
                }
                else
                    socket.emit('orders.add-fail', err);
            }
        });

        socket.on('users.getByLogin', function onGetUserByLoginRequest(data){
            db.User.findOne({login: data.login}, function onFind(err, user) {
                if(!err){
                    socket.emit('users.getByLogin-success', {
                        id: user._id,
                        login: user.login,
                        profile: {
                            name: user.profile.name,
                            lastName: user.profile.lastName,
                            status: user.profile.status.name
                        }
                    });
                }
                else{
                    socket.emit('users.getByLogin-fail', err);
                }
            })
        });
    });

    return io;
};
