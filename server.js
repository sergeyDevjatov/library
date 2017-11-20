const express = require('express'),
    app = express(),
    port = process.env.PORT || 80;
const fs = require('fs');

const root_file = 'index.html';

let server = app.get('/*', function (req, res) {
    let filename = fs.existsSync(req.params['0']) ? req.params['0'] : root_file;
    res.sendFile(__dirname + '/' + filename);
}).listen(port, function () {
    console.log('Listening on port ', port)
});

let io = require('socket.io')(server);


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('auth.sign_in', function(data){
        if(data.login === 'root' && data.password === 'root'){
            socket.emit('auth.sign_in-success', {sid: 'your_sid'});
        }
        else{
            socket.emit('auth.sign_in-fail');
        }
    });

    socket.on('auth.sign_out', function(data){
        if(data.sid === 'your_sid'){
            socket.emit('auth.sign_out-success');
        }
        else{
            socket.emit('auth.sign_out-fail');
        }
    });

});
