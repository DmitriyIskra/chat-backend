const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');  
const uuid = require('uuid');  
const WS = require('ws');
const usersList = require('./db/user/usersList');

const Router = require('koa-router');
const router = new Router();

const app = new Koa();

// const router = require('./routes');


app.use(koaBody({ 
    text: true,    
    urlencoded: true, 
    multipart: true, 
    json: true, 
  }));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});


router.get('/checkName/:name', async (ctx) => { // get это значит по запросу с методом GET
  const { name } = ctx.params;
  
  ctx.set('Access-Control-Allow-Origin', '*');

  if(usersList.findName(name)) {
    ctx.response.body = 'this name is busy';
    ctx.response.status = 200;
    return;
  }

  ctx.response.body = 'free';
  ctx.response.status = 200; 
});



router.post('/user', ctx => { 
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  ctx.set('Access-Control-Allow-Credentials', true);
  console.log('ctx', ctx) 

  

  ctx.response.body = '{"name": "busy"}'; 
  ctx.response.status = 200;  
})



// app.use(router()); 
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7000; 
const server = http.createServer(app.callback());
 
server.listen(port); 