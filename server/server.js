module.exports = function(port = process.env.PORT, root) {
    const express = require('express'),
        app = express();
    const fs = require('fs');
    const path = require('path');

    let index_path = path.join(root, 'index.html');

    let server = app.get('/*', function (req, res) {
        let req_path = path.join(root, req.params['0']);
        let res_path = undefined;
        try{
            let stat = fs.lstatSync(req_path);
            if(stat.isFile()){
                res_path = req_path;
            }
            else if(stat.isDirectory()){
                let req_path_with_index = path.join(req_path, 'index.html');
                if(fs.existsSync(req_path_with_index))
                    res_path = req_path_with_index;
                else {
                    res.status(403).send('<h1>Forbidden!</h1><h3>Access denied.</h3>');
                    return;
                }
            }
            else{
                res_path = index_path;
            }
        }
        catch (err) {
            res_path = index_path;
        }
        res.sendFile(res_path);
    }).
    listen(port, function () {
        console.log('Listening on port ', port)
    });

    return server;
};
