const Sequelize = require('sequelize');
const faker = require('faker');
const MTALineModal = require('./models/Lines.js');

const DATABASE = process.env.SEQ_DB;

const USER = process.env.SEQ_USER;

const PASSWORD = process.env.SEQ_PW;

const DB_URL = process.env.DATABASE_URL;

console.log(DATABASE, USER, PASSWORD, DB_URL);

const dbInit = new Sequelize('', USER, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const line = ['A', 'B', 'C', 'D', 'E', 'F'];

function instantiateData(lineModal) {
  lineModal.sync({ force: true })
    .then(() => {
      for (let i = 0; i < 6; i += 1) {
        lineModal.create({
          feedId: i,
          line: line[i],
          downTime: 1000 * 60 * 60 * (i + 1),
          createDate: Date.now() - (1000 * 60 * 60 * 24 * (i + 1)),
          status: i % 2 === 1 ? 'DELAYED' : 'NOT_DELAYED',
          lastStatusUpdateDate: Date.now(),
        });
      }
    })
    .then(() => {
      console.log(`Data seeded in ${DATABASE}`);
    });
}

dbInit.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`)
  .then(() => {
    console.log(`Database ${DATABASE} created`);
    const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
    });
    instantiateData(MTALineModal(sequelize));
  });

module.exports = {
  instantiateData,
};
