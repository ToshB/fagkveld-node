var fs = require('fs');

module.exports = {
  hello: function (request, response){
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');
  },
  aww: function(request, response){
    fs.readFile(__dirname + '/image.jpeg', function (error, data){
      response.writeHead(200, { 'Content-Type': 'image/jpeg' });
      response.end(data);
    });
  },
  err: function(request, response){
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end();
  }
};
