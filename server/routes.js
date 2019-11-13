const db = require('../database/index');

module.exports = {
  getAllLineStatuses: (req, res) => {
    db.getAllLineStatuses(res.send.bind(res));
  },
  getLineStatus: (req, res) => {
    const line = req.params.id;
    db.getLineStatus(line, res.send.bind(res));
  },
  getLineUptime: (req, res) => {
    const line = req.params.id;
    db.getLineUptime(line, res.send.bind(res));
  },
};
