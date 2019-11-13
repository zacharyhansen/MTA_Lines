const express = require('express');

const cors = require('cors');

const app = express();

const mtaAPI = require('../api/mtaAPI');

const routes = require('./routes');

app.use(cors());

app.use('/', express.static('public'));

app.get('/all', routes.getAllLineStatuses);
app.get('/status/:id', routes.getLineStatus);
app.get('/uptime/:id', routes.getLineUptime);

app.listen(3003, () => console.log(`
  Now I'm listening at port 3003
`));

setInterval(mtaAPI.getMTAData, 10000);
