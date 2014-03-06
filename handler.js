var sayHello = require('./sayHello');
var fs = require('fs');

module.exports = {
  hello: function(request, response){
    response.writeHeader(200, { 'Content-Type': 'text/plain'});
    response.end(sayHello());
  },
  data: function(request, response){
    response.writeHeader(200, { 'Content-Type': 'application/json'});
    var obj = {data: 'hello'};
    response.end(JSON.stringify(obj));
  },
  image: function(request, response){
    fs.readFile(__dirname + '/image.jpeg', function(error, data){
      response.writeHeader(200, { 'Content-Type': 'image/jpeg'});
      response.end(data);
    });
  }
};
