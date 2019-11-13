const Sequelize = require('sequelize');

const MTALinesModel = require('./models/Lines.js');

const { statuses } = require('./constants');

const sequelize = new Sequelize(process.env.SEQ_DB, process.env.SEQ_USER, process.env.SEQ_PW, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Returns line and status
const getAllLineStatuses = function (callback) {
  const queryResult = [];
  const MTALines = MTALinesModel(sequelize);
  MTALines.findAll()
    .then(((result) => {
      result.forEach((line) => {
        queryResult.push({
          line: line.get('line'),
          status: line.get('status'),
        });
      });
      callback(JSON.stringify({ eventMessage: queryResult }));
      return queryResult;
    }));
};

// Returns line and status
const getLineStatus = function (line, callback) {
  const queryResult = {};
  const MTALines = MTALinesModel(sequelize);
  MTALines.findOne({
    where: { line },
  })
    .then(((result) => {
      if (result) {
        queryResult.line = result.get('line');
        queryResult.status = result.get('status');
        callback(JSON.stringify({ eventMessage: queryResult }));
        return result;
      }
      queryResult.line = statuses.unknown;
      queryResult.status = statuses.unknown;
      callback(JSON.stringify({ eventMessage: queryResult }));
    }));
};


// Returns the % of time(ms) since createDate that line has been NOT_DELAYED
const getLineUptime = function (line, callback) {
  console.log('uptime', line);
  const queryResult = {};
  const MTALines = MTALinesModel(sequelize);
  MTALines.findOne({
    where: { line },
  })
    .then(((result) => {
      if (result) {
        const createDate = result.get('createDate');
        let totalTimeDelayed = result.get('downTime');
        // If current status is delayed, add the time from the last status update till now
        if (result.get('status') === 'DELAYED') {
          let lastStatusUpdateDate = result.get('lastStatusUpdateDate');
          totalTimeDelayed += Date.now() - new Date(lastStatusUpdateDate).getTime();
        };
        queryResult.line = result.get('line');
        queryResult.upTime = 1 - (totalTimeDelayed / (Date.now() - new Date(createDate)));
      } else { // else we have no record of requested line, return UNKNOWN
        queryResult.line = statuses.unknown;
        queryResult.upTime = statuses.unknown;
      }
      callback(JSON.stringify({ eventMessage: queryResult }));
      return result;
    }));
};

const addLine = function (lineInformation) {
  const MTALines = MTALinesModel(sequelize);
  MTALines.create({
    feedId: 10,
    line: 'ADD',
    downTime: 1000 * 60 * 60 * 20,
    createDate: Date.now(),
    status: statuses.delayed,
    lastStatusUpdateDate: Date.now(),
  });
};

const upsertLine = function (lineInformation = {}) {
  const MTALines = MTALinesModel(sequelize);
  MTALines.findOne({
    where: {
      line: 'A',
    }
  })
    .then((obj) => {
      if (obj) { // update
        let previousStatus = obj.get('status');
        if (previousStatus !== lineInformation.status && (lineInformation.status === statuses.delayed || lineInformation.status === statuses.notDelayed)) {
          if (lineInformation.status === statuses.delayed) {
            // Line is now delayed, update line with new status and time of status update
            return obj.update({
              line: 'UPDATE',
              status: statuses.delayed,
              lastStatusUpdateDate: lineInformation.statusUpdateDate || Date.now(),
            });
          }
          if (lineInformation.status === statuses.notDelayed) {
            // Line is not not delayed, update line with status, time of status update, and total down time with
            return obj.update({
              line: 'UPDATE',
              downTime: obj.get('downTime') + ((lineInformation.statusUpdateDate || Date.now()) - obj.get('lastStatusUpdateDate')),
              createDate: Date.now(),
              status: statuses.notDelayed,
              lastStatusUpdateDate: Date.now(),
            });
          }
        }
        // Below block is not needed, simply for demo purposes
        // return obj.update({
        //   feedId: 10,
        //   line: 'UPDATE',
        //   downTime: Math.floor(Math.random() * 6 * 100) / 100,
        //   createDate: Date.now(),
        //   status: 'DELAYED',
        //   lastStatusUpdateDate: Date.now(),
        // });
      } else { // insert
        // Dummy data for now
        return MTALines.create({
          feedId: 10,
          line: 'CREATE',
          downTime: Math.floor(Math.random() * 6 * 100) / 100,
          createDate: Date.now(),
          status: 'DELAYED',
        });
      }
    });
};

module.exports = {
  getLineStatus,
  getLineUptime,
  getAllLineStatuses,
  addLine,
  upsertLine,
};
