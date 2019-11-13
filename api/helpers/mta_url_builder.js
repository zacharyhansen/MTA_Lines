const getLineURL = () => (`http://datamine.mta.info/mta_esi.php?key=${process.env.API_KEY}&feed_id=1`);

const urlGenerator = {
  getLineURL,
};

module.exports = urlGenerator;
