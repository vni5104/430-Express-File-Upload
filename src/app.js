const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const fileUpload = require('express-fileupload');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/FileUpload';
mongoose.connect(dbURL).catch((err) => {
  if (err) {
    console.log('Could not connect to the database');
    throw err;
  }
});

const app = express();
app.use(compression());
app.use(fileUpload());

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(express.urlencoded({
  extended: true,
}));
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');

app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
