var express = require('express');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');

var PORT = 8000;
var HOSTNAME = 'localhost';

var app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');

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

  fs.readFile(request.files.logs.path, function (err, data) {
    var newPath = __dirname + "/../uploads/uploadedFileName";
    fs.writeFile(newPath, data, function (err) {
      if (err) {
	response.end(err);
      } else {
	fs.readFile(newPath, 'utf8', function(err, data) {
          if (err) {
	    response.end(err);
	  } else {
	    var datas = data.split('\n');
	    response.render('logs',{
	      logs: datas
	    });
	  }
        });
      }
    });
  });
});


app.listen(PORT, HOSTNAME, function () {
  console.log('Server running at ' + HOSTNAME + ':' + PORT + ' ...');
});
