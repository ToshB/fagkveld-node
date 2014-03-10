var greeting = require('./greeting');
var fs = require('fs');

var hello = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain'});
  response.end(greeting());
};

var data = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'application/json'});
  var obj = {data: 'hello'};
  response.end(JSON.stringify(obj));
};

var file = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'image/jpeg'});
  fs.createReadStream(__dirname + '/image.jpeg')
    .pipe(response);
};

module.exports = {
  hello: hello,
  data: data,
  file: file
};
