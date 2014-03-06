var express = require('express');
var requestHandler = require('./requestHandler');
var app = express();
var port = process.env.PORT || 8080;

app.get('/', requestHandler.hello);
app.get('/data', requestHandler.data);
app.get('/aww', requestHandler.image);

app.listen(port);
console.log('Server listening on port http://localhost:'+port);
