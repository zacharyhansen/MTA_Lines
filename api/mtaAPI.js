
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const request = require('request');

const urlGenerator = require('./helpers/mta_url_builder');

const db = require('../database/index');

const requestSettings = {
  method: 'GET',
  url: urlGenerator.getLineURL(),
  encoding: null,
};

const getMTAData = () => {
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      db.upsertLine();
      feed.entity.forEach(function (entity, index) {
        if (entity.tripUpdate) {
          // console.log(JSON.stringify(entity.tripUpdate))
        }
      });
    } else {
      console.log('res', response, error)
    };
  });
};

module.exports = { getMTAData };
