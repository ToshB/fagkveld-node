var handler = require('./handler'); // Last vår modul
var express = require('express');
var app = express();
var port = 8080;

app.get('/', handler.hello);        // Gi referanse til våre handlere
app.get('/data', handler.data);
app.get('/file', handler.file);

app.listen(port);

console.log('Server listening on http://localhost:'+port);
