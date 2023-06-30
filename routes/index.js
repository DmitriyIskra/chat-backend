const combineRouters = require('koa-combine-routers');

const users = require('./users/index.js');

const router = combineRouters({
    users
});


module.exports = router; 