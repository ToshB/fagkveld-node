var express = require('express');
var responseHandler = require('./handler');
var app = express();
var port = process.env.PORT || 8080;

app.get('/', responseHandler.hello);
app.get('/data', responseHandler.data);
app.get('/aww', responseHandler.image);
//app.listen(port);

console.log('Server listening on http://localhost:'+ port);
