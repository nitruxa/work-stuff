const http = require('http');
// var url = require('url');
// var playlist = require('./playlist');

var PORT = 8000;
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('./iptv.txt', (err, data) => {
        if (err) {
            throw err;
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(data, 'utf-8');
    });
    // playlist().then(data => {
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.end(data, 'utf-8');
    // });
}).listen(PORT);
