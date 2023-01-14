const express = require('express');
const debug = require('debug')('graphql-sqlite3-server:app');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const schema = require('./schema-graphql');

const app = express();

// allow cross-origin requests
app.use(cors());

app.use('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'imgs', 'favicon.ico'));
});

app.use('/favicon.png', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'imgs', 'favicon.png'));
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use('/backup', (req, res) => {
  fs.copyFileSync(path.resolve(__dirname, 'db', 'database.sqlite3'), path.resolve(__dirname, 'db', 'database-bak.sqlite3'));
  res.json({ message: 'Database has been backup.' });
});

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to GraphQL Server.' });
});

// catch 404 Not found middleware
app.use((req, res, next) => {
  debug('Not found url', req.url);
  const err = new Error(`The page requested does not exist.`);
  res.status(404).json({ err });
});

//Global error middleware handler
app.use(function(err, req, res, next) {
  debug('Global error', err);
  if (err && err.status === 404) {
    err.message = 'The page requested does not exist.';
    res.status(404).json({ err });
  } else {
    if (!err.message)
      err.message = 'Ooops! It looks like something went wrong on the server.';
    res.status(err.status || 500).json({ err });
  }
});

module.exports = app;
