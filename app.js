// const cookieSession = require("cookie-session");
// const session = require("express-session");
import express from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
const Config = require('./config/config').getConfig();
const api = require("./routes/v1");

const app = express();

const userLoggedIn = require("./middleware/userLoggedIn");

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

app.use(passport.initialize());
app.use(passport.session());

const mongooseOptions = {
  useMongoClient: true
};
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${Config.db.host}/${Config.db.database}`, mongooseOptions);

app.use(userLoggedIn);
app.use("/api/v1", api);

app.use(function(req, res, next){
  const err = new Error("Resource not Found");
  err.status = 404;
  next(err);
});

app.use(function(error, req, res, next){
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
  next(error);
});

app.listen(3000, function(){
  console.log("App Running");
});
