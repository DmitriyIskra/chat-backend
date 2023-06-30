const Router = require('koa-router');
const usersList = require('../../db/user/usersList');

const router = new Router();

router.get('checkName/:name', async ctx => {
    const { name } = ctx.params;

    ctx.set('Access-Control-Allow-Origin', '*');
    console.log('ctx-params', name);
})

module.exports = router;