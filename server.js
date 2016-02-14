var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

//database needs to be setup ahead of time before connecting
mongoose.connect('mongodb://localhost/pixelpainter_mongoose_demo');

//Schema = model, so drawing model
var drawingSchema = mongoose.Schema({name: String});
//intsantiating Drawing (model), drawings (database)
var Drawing = mongoose.model('Drawing', drawingSchema);

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/drawings', function (req, res){
  //model.find() uses anonymous function which needs two parameters
  //err and success result
  Drawing.find({}, function (err, drawings){
    if(err){
    res.send('Error ' + err + 'is not valid');
    }
    res.json(drawings);
  });
});


app.get('/drawings/:id', function (req, res){
  var drawingId = req.params.id;
  //drawing singular since ONE drawing
  //error and success result
  Drawing.findById(drawingId, function (err, drawing){
    res.json(drawing);
  });
});

app.post('/drawings', function (req, res){
  //can add a variabe to add and validate properties to the req.body
  // var data = req.body{}
  //make validations if name etc
  var newDrawing = new Drawing(req.body);
  console.log('req.body', req.body);
  newDrawing.save();
  res.send('saved');
});

app.put('/drawings/:id', function (req, res){
  var drawingId = req.params.id;
  var drawingName = req.body.name;
  //error and success result
  //via postman changed name value
  //$set ensures doesn't overwrite everything, including other properties
  //$set ensures just the name will change
  Drawing.findByIdAndUpdate(drawingId,{$set: {name: drawingName}}, function (err, drawing){
    res.json(drawing);
  });
});

/***USE BELOW instead***/
//var server = app.listen(3000, function (){
//   console.log('Server is listening', server.address().port);
// });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
//db.once is an event listener, and now app.listen can be a call back
  db.once('open', function (){
    console.log('db connected');
    app.listen(3000, function () {
      console.log('listening on 3000');
    });
  });
