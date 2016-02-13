var express = require('express');
var app= express();
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));

var server = app.listen(3000, function (){
  console.log('Server is listening', server.address().port);
});