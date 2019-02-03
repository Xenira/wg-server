import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as path from 'path';
// import * as favicon from 'serve-favicon';

import HttpError from './config/error';

// ####################################
// Import passport and mongoDB inits
// ####################################
import './config/passport';
import './models/db';

import router from './routes';

const app = express();

if (app.get('env') === 'development') {
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
}

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookie: { secure: app.get('env') !== 'development', maxAge : 3600000 },
  resave: true, saveUninitialized: true,
  secret: 'keyboard cat',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', router);

// error handlers

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Unauthorized Error
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    return res.json({ message: err.name + ': ' + err.message });
  }
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.warn('Registering dev error handler. If you see this message in prod use, there is something wrong.');
  app.use((err: HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message,
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err: HttpError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: {},
      message: err.message,
    });
  });
}

export default app;
