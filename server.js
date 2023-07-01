const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');  
const CORS = require('@koa/cors');
const uuid = require('uuid');  
const moment = require('moment-timezone');
const WS = require('ws');
const usersList = require('./db/user/usersList');
const chat = require('./db/chat/chat');




const Router = require('koa-router'); 
const router = new Router();    

const app = new Koa();  

// const router = require('./routes/index');
 
app.use(CORS());

app.use(koaBody({  
    text: true,      
    urlencoded: true, 
    multipart: true, 
    json: true,   
  }));  



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



// app.use(router()); 
app.use(router.routes()).use(router.allowedMethods());   

const port = process.env.PORT || 7000; 
const server = http.createServer(app.callback()); 
 
const wsServer = new WS.Server({
  server
})       

    

wsServer.on('connection', (ws) => {
  ws.on('message', (buffer) => {

    let arr = [];
    let data

    let view = new Uint16Array(buffer);
 
    for(let i = 0; i < view.length; i += 1) { 
      arr[i] = String.fromCharCode(view[i]); 
    }   
   
    const json = arr.join('');
    
    data = JSON.parse(json);   
   
    
 
    // ---- если есть title и он равен start 
    if(data?.title && data.title === 'start') {  
      console.log('ws start working')  

      const { id, name } = data;            
         
      const client = ws;   
      
      usersList.add({id, name, ws: client});   
 
      // создаем дату для админа
      const date  = moment().format('DD.MM.YY HH:mm');  
      chat.messages.forEach( item => {
        if(item.id === '1') item.date = date;      
      }) 

      let bothDB = {users: [...usersList.users], chat: [...chat.messages]};

      const eventData = JSON.stringify({title: 'start', data: bothDB});

      Array.from(wsServer.clients) 
      .filter( client => client.readyState === WS.OPEN)
      .forEach( client => client.send(eventData));   
      
      return; 
    }    
 
  
   
    //---- если пришло сообщение, а не регистрация    
               
    // создаем дату  
    const date  = moment().format('DD.MM.YY HH:mm'); 
   
    // ищем имя клиента по экземпляру коннекта ws
    const { name } = usersList.users.find( item => item.ws === ws);

    // Забираем сообщение
    const { message } = data;
 
    // Находим соответствующий id
    const id = usersList.findId(ws) 

    const itemMessage = {
      id,
      name,  
      date, 
      message,  
    }       
              
    // пушим в db      
    chat.add(itemMessage);  
  
    // создаем json для отправки на клиент   
    const eventData = JSON.stringify({ title: 'message', chat: itemMessage })   

    // отправляем сообщение всем клиентам активным 
    Array.from(wsServer.clients)    
    .filter( client => client.readyState === WS.OPEN)   
    .forEach( client => client.send(eventData)); // отправляем объект с ключем chat и в нем массив с сообщением
  
     
  })     

  ws.on('close', e => {
    console.log('close working')             
    // Удаляем клиента по экземпляру connect websocket
    usersList.delete(ws);     
    
    const data = {title: 'close', data: [...usersList.users]}

    const eventData = JSON.stringify(data) 

    Array.from(wsServer.clients) 
      .filter( client => client.readyState === WS.OPEN)
      .forEach( client => client.send(eventData));
      
    return;       
  })     

  // проверить отправится ли id при закрытии соединения

  ws.send(JSON.stringify({status: 'Подключение установлено'}));
})

server.listen(port);  