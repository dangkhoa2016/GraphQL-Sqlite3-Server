const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
// require('dotenv').config();
var fs = require('fs');
const schema = require('./schema-graphql');

const app = express();

// allow cross-origin requests
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use("/backup", (req, res) => {
  fs.copyFileSync('./database.sqlite3', './database-bak.sqlite3');
  res.json({ msg: 'Database has been backup' });
});

app.use("/", (req, res) => {
  res.json({ msg: 'Welcome to graphql' });
});

// catch 404 Not found middleware
app.use((req, res, next) => {
  console.log("Not found", req.url);
  const err = new Error(`The page requested does not exist.`);
  res.status(404).json({ err });
});

//Global error middleware handler
app.use(function(err, req, res, next) {
  // console.log("Global error", err);
  if (err && err.status === 404) {
    err.message = `The page requested does not exist.`;
    res.status(404).json({ err });
  } else {
    if (!err.message)
      err.message = `Ooops! It looks like something went wrong on the server.`;
    res.status(err.status || 500).json({ err });
  }
});

module.exports = app;
