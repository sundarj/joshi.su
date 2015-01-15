var express = require('express');
var app = express();
var compression = require('compression');

app.use(compression());
app.use(express.static(__dirname));
app.listen(8080);
console.log("server started");