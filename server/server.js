module.exports = function(port = process.env.PORT, root) {
    const express = require('express');
    let app = express();
    const fs = require('fs');
    const path = require('path');
    const server = require('http').Server(app).listen(port);
    const session = require('express-session');

    let SECRET = 'secret';

    let cookieParser = require('cookie-parser')(SECRET);
    let sessionStore = new session.MemoryStore();

    app.use(cookieParser);
    app.use(session({ secret: SECRET, store: sessionStore }));

    function chooseResponsePath(requestPath){
        let INDEXPATH = path.join(root, 'index.html');

        let stat;
        try {
            stat = fs.lstatSync(requestPath);
        }
        catch (err){
            if(err.code === 'EACCES')
                throw new Error('403');
            else if(err.code === 'ENOENT')
                return INDEXPATH;
            else
                throw err;
        }
        if(stat.isFile()){
            return requestPath;
        }
        else if(stat.isDirectory()){
            let requestPathWithIndex = path.join(requestPath, 'index.html');
            if(fs.existsSync(requestPathWithIndex))
                return requestPathWithIndex;
            throw new Error('403');
        }
    }

    app.get('/*', function (req, res) {
        let reqPath = path.join(root, req.params['0']);
        try{
            let resPath = chooseResponsePath(reqPath);
            res.sendFile(resPath);
        }
        catch (err) {
            if(err.message === '403')
                res.status(403).send('<h1>Forbidden!</h1><h3>Access denied.</h3>');
            else
                throw err;
        }
    });

    return {server, cookieParser, sessionStore};
};
