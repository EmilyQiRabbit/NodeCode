// 这个是官网的例子，是一个完整的 web 应用。
// 也可以理解为一个服务器软件，它在 8080 端口，提供了一个简单的 web 服务。
// 运行它需要在控制台输入：node fileName.js
// 如果 localhost 无法访问，可能需要配置 host switch.

const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
//var webPush = require('web-push');
const app = express();

const server = app.listen(9090, function () {
  const address = server.address();
  //console.log('Example app listening at address: ', address);
});

app.set('views', './views') // 过滤器，表示模版放在 ./views 文件下
app.set('view engine', 'ejs')

// bodyParser
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
app.use(bodyParser.text());

// 如果没有这个 use 函数的调用，启动服务可能会看到很多的 404 错误，因为我们仅提供了 / 地址下的路由请求，其他任何地址，Node.js都默认转向404错误
app.use(express.static('./public', {
  maxAge: '0', //no cache
  etag: true
}));

// 上面的代码意思是，在public下的文件，包括js,css,images，fonts等都当作静态文件处理，
// 根路径是./public,请求地址就相对于/，比如：./public/js/app.js文件，
// 请求地址就是http://localhost:3000/js/app.js

// 渲染 blockChain
app.get('/blockChain', function (req, res, next) {
  res.render('TheBlockChain');
  next()
});

// 尝试 pwa
app.get('/PWAFirstTaste', function (req, res, next) {
  res.render('PWAFirstTaste');
  next()
});

// 渲染 d3Chart
app.get('/d3Chart', function (req, res, next) {
  res.render('theFirstNodeWithD3');
  next()
});

app.use('/api', require('./router/blockRouter'))

// 测试中间件
app.use(function (req, res, next) {
  console.log(req.query);
  next()
});

app.use(function (req, res, next) {
  console.log('testing use');
  next()
});

app.use(function (req, res, next) {
  console.log('if continue?');
  next()
});

 // 测试 event -> 自带模块
var events = require('events');
var eventEmitter = new events.EventEmitter();

eventEmitter.on('my_event', function() { 
  console.log('my_event 事件触发'); 
}); 

setTimeout(function() { 
  eventEmitter.emit('my_event'); 
}, 1000); 


