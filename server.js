const express = require('express')
    , app = express()
    , port = process.env.PORT || 80;
const fs = require('fs');
const root_file = 'index.html';

app.get('/*', function (req, res) {
    let filename = fs.existsSync(req.params['0']) ? req.params['0'] : root_file;
    fs.readFile(filename, 'utf-8', (err, content) => {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end(content);
    });
}).listen(port, function () {
    console.log('Listening on port ', port)
});