module.exports = function(port = process.env.PORT, root) {
    const express = require('express'),
        app = express();
    const fs = require('fs');
    const path = require('path');

    let index_path = path.join(root, '/index.html');

    let server = app.get('/*', function (req, res) {
        let req_path = path.join(root, req.params['0']);
        let res_path = fs.existsSync(req_path) ? req_path : index_path;
        console.log(res_path);
        res.sendFile(res_path);
    }).
    listen(port, function () {
        console.log('Listening on port ', port)
    });

    return server;
};
