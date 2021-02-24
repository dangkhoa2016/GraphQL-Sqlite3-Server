

const db = require('./models');
const app = require('./app');


const SERVER_PORT = process.env.PORT || 4000;

//drop and resync with { force: true }
db.sequelize.sync().then(() => {

  app.listen(SERVER_PORT, () =>
    console.log(`Server up and running on port ${SERVER_PORT}...`)
  );
}).catch((err) => {
  console.log('Error sync sequelize', err)
});
