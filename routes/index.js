const combineRouters = require('koa-combine-routers');

const users = require('./users/index');

const router = combineRouters({
    users
});


module.exports = router; 