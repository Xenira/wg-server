import * as mongoose from 'mongoose';

// tslint:disable-next-line:no-var-requires
const dbURI = process.env.DB_URI || require(__dirname + '/../../config.json').db.uri;

mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error: ' + err);
  process.exit(1);
});
mongoose.connection.on('disconnected', () => {
  console.error('Mongoose disconnected');
  process.exit(1);
});

// #################################
// Import all mongo DB models here
// #################################
import './user.model';

import './planer';
