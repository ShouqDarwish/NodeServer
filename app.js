/////////////////////////////////////////////////////////////////////////////////////
//Smart learning dice 
//Application server



//MongoDB Connection
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 

var mongoose = require("mongoose");
mongoose.connect("mongodb://shouqdarwish:Mais1996@ds015899.mlab.com:15899/smartlearningdice");


var db = mongoose.connection;
 
 db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connected to MongoDB");
 });
 

var userSchema = mongoose.Schema({
  wispid: String,
  wispname: String
});

var User = mongoose.model('User', userSchema);


var scoreSchema = mongoose.Schema({
wispid: String,
gamemode: String,
score: String
});

var Score = mongoose.model('ScoreStat', scoreSchema);


/////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////



//NewCode



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();




// var s1 = new Score({
// wispid: "1",
// gamemode: "seq",
// score: "1"
// });

//  s1.save(function(error) {
//      console.log("Your account has been saved!");
//  if (error) {
//      console.error(error);
//   }
//  });

//GET

  app.get('/users', function(req, res) {
 
       // console.log("fetching dice");
 
        // use mongoose to get all reviews in the database
        User.find(function(err, d) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(d); // return all reviews in JSON format
      console.log(d);
        });
    });



  app.get('/scores', function(req, res) {
 
 
        // use mongoose to get all reviews in the database
        Score.find(function(err, d) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(d); // return all reviews in JSON format
      console.log(d);
        });
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/adduser', function(req, res) {

  var u = new User({
  wispid: req.body.wispid,
  wispname: req.body.wispname
});
 
 u.save(function(error) {
     console.log("Your account has been saved!");
 if (error) {
     console.error(error);
  }
 });

});



app.post('/addscore', function(req, res) {

  var s = new Score({
  wispid: req.body.wispid,
  gamemode: req.body.gamemode,
  score: req.body.score,
});
 
 s.save(function(error) {
     console.log("Your score has been saved!");
 if (error) {
     console.error(error);
  }
 });

 Score.find(function (err, u) {
  if (err) return console.error(err);
  console.log(u);
})

});


// app.get('/gamescore', function(req, res) {

//  Score.find({wisp1id: "1", wisp2id: "2"}, function (err, u) {
//      if (err)
//                 res.send(err)
 
//             res.json(u); // return all reviews in JSON format
//       console.log(u);
// })

// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});



app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = Dice;
module.exports = app;
