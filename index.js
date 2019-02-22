'use strict';

global.Promise = require('bluebird')

require('egg').startCluster({
    baseDir: __dirname,
    port: process.env.PORT || 7011,
    workers: 1
});

