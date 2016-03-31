var express = require('express');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');

var PORT = 8000;
var HOSTNAME = 'localhost';

var app = express();
app.use(morgan('dev'));

var multipartMiddleware = multipart();

app.get('/', function (request, response) {
  var filePath = path.resolve('./public/index.html');
  fs.exists(filePath, function (exists) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(filePath).pipe(response);
  });
});

app.post('/upload', multipartMiddleware, function (request, response) {
  console.log(request.body, request.files);
  response.end("done");
});


app.listen(PORT, HOSTNAME, function () {
  console.log('Server running at ' + HOSTNAME + ':' + PORT + ' ...');
});
