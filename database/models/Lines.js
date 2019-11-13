const Sequelize = require('sequelize');

const mtaLineSchema = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  feedId: {
    type: Sequelize.INTEGER,
  },
  line: {
    type: Sequelize.STRING,
  },
  createDate: {
    type: Sequelize.DATE,
  },
  downTime: {
    type: Sequelize.INTEGER,
  },
  status: {
    type: Sequelize.STRING,
  },
  lastStatusUpdateDate: {
    type: Sequelize.DATE,
  },
};

const model = (sequelize) => {
  const MTALine = sequelize.define('mtaLine', mtaLineSchema, { timestamps: false });
  return MTALine;
};

module.exports = model;
