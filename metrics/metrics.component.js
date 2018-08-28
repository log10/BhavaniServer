'use strict';

const route = require('koa-route');
const monk = require('monk');

const db = monk('localhost/metrics');

db.then(() => console.log('Connected correctly to server: metrics'));

const log = db.get('log');

const METRICS_PATH = '/metrics';

module.exports = app => {
  // registering the route
  app.use(route.post(METRICS_PATH, save));
};

async function save(metrics) {
  console.log(this.request.body);
  console.log(await log.insert(this.request.body));
  this.status = 201;
}