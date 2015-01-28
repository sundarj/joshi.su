var express = require('express');
var app = express();
var compression = require('compression');
var system = require('child_process').exec;

app.get('/', function(req, res, next) {
   console.log(req.headers["accept-language"]);
   next();
});

app.use(compression());
app.use(express.static(__dirname));
app.listen(8080);
system("google-chrome 0.0.0.0:8080", function (e, out, err) {});
