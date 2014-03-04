var express = require('express');
var app = express();
var requestHandler = require('./handler');
var port = process.env.PORT || 8080;

app.get('/', requestHandler.hello);
app.get('/hi', requestHandler.hi);
app.get('/aww', requestHandler.image);
app.listen(port);

console.log('Server listening on http://localhost:'+port);
