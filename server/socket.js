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
        });

    });

    return io;
};
