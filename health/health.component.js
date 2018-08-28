'use strict';

const route = require('koa-route');

const HEALTH_PATH = '/health';

module.exports = app => {
  // registering the route
  app.use(route.get(HEALTH_PATH, ctx => ctx.body = 'Server is running!'));
};