'use strict';
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const logger = require('koa-logger');
const koa = require('koa');
const path = require('path');
const fs = require('fs').promises;
const cors = require('@koa/cors');
const app = module.exports = new koa();

const APP_PORT = 8000;
const CORS_LIST = ['http://localhost', 'http://localhost:8080', 'http://www.loguvinkadhaigal.com']

app.use(logger());
app.use(compress());
app.use(bodyParser());
app.use(cors({origin: ctx => CORS_LIST.indexOf(ctx.get('origin')) > -1 ? ctx.get('origin') : null}));

// Load modules
async function loadModules(path) {
  const files = await fs.readdir(path);
  await Promise.all(files.map(async file => {
    const fullPath = path + file;
    console.log('processing... ' + fullPath);
    if (file.substr(-13, 13) === '.component.js') {
      console.log('loading... ' + fullPath);
      require(fullPath)(app);
    } else if (file !== 'node_modules') {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await loadModules(fullPath + '/');
      }
    }
  }));
}

loadModules('./').then(() => {
  if (!module.parent) {
    app.listen(APP_PORT);
    console.log('listening on port ' + APP_PORT);
  }
});
