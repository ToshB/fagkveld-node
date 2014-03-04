var sayHello = require('./hello');
var fs = require('fs');

var hello = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(sayHello());
};

var hi = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end('Hi');
};

var image = function(request, response){
  fs.readFile(__dirname + '/image.jpeg', function(err, data){
    response.writeHeader(200, { 'Content-Type': 'image/jpeg' });
    response.end(data);
  });
};

module.exports = {
  hello: hello,
  hi: hi,
  image: image
};
