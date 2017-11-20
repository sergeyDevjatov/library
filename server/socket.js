module.exports = function (server) {
    const user = require('./user.js');
    const _ = require('underscore');
    const crypto = require('crypto');

    let db = require('./connect.js')();
    let io = require('socket.io')(server);

    io.on('connection', function (socket) {


        socket.on('auth.sign_in', function (data) {
            db.User.find({login: data.login}, function (err, users) {
                if(_.find(users, (self) => self.password === user.hash(data.password, self.salt))){
                    socket.sid = crypto.randomBytes(16).toString('hex');
                    socket.emit('auth.sign_in-success', {sid: socket.sid});
                    console.log(socket.sid);
                }
                else{
                    socket.emit('auth.sign_in-fail');
                }
            });
        });

        socket.on('auth.sign_up', function (data) {
            db.User.find({login: data.login}, function (err, users) {
                if(_.isEmpty(users)){
                    admin = new db.User(user.create(data.login, data.password));
                    admin.save(function (err) {
                        if (!err) {
                            socket.sid = crypto.randomBytes(16).toString('hex');
                            socket.emit('auth.sign_up-success', {sid: socket.sid});
                        }
                        else{
                            console.log(err);
                            socket.emit('auth.sign_up-fail', err);
                        }
                    });
                }
            });
        });

        socket.on('auth.sign_out', function (data) {
            if (data.sid === socket.sid) {
                socket.sid = undefined;
                socket.emit('auth.sign_out-success');
            }
            else {
                socket.emit('auth.sign_out-fail');
            }
        });

    });

    return io;
};
