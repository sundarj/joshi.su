var express = require('express');
var app = express();
var compression = require('compression');

app.get('/', function(req, res, next) {
   console.log(req.headers["accept-language"]);
   next();
});

app.use(compression());
app.use(express.static(__dirname));
app.listen(8080);
