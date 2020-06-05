const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// To enable cors request form other service
// TO DO: restrict to certain URLs only
app.use(cors());
if (process.env.NODE_ENV !== 'test') { app.use(logger('dev')); }

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.error = err;

  if (!err.status) {
    res.status(500);
  } else {
    res.status(err.status);
  }
  console.trace(err.message);
  res.send(err);
});

module.exports = app;
