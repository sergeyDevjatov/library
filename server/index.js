const path = require('path');
let server = require('./server.js')(80, path.resolve(__dirname + '/..'));
let io = require('./socket.js')(server.server, server.sessionStore, server.cookieParser);