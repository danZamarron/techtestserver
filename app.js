require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const flash        = require("connect-flash")
const cors         = require("cors")


mongoose
  .connect(process.env.DB || 'mongodb://localhost/techtestserver', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Passport Init
app.use(flash())
require('./configs/session')(app);

app.use(
  cors({
    origin: [process.env.CORS_URL],
    credentials: true
  })
)


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public/build')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/task', require('./routes/task'));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname+'/public/build/index.html'));
})




module.exports = app;
