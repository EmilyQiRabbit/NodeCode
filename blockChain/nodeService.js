// 这个是官网的例子，是一个完整的web应用。
// 也可以理解为一个服务器软件，它在 8080 端口，提供了一个简单的web服务。
// 运行它需要在控制台输入：node fileName.js
// 如果 localhost 无法访问，可能需要配置 host switch.

var express = require('express');
var app = express();

// app.get('/', function (req, res) {
//   console.log('visiter comes');
//   //res.send('Hello World!');
// });

var server = app.listen(8080, function () {
  var address = server.address();

  console.log('Example app listening at address: ', address);
});

app.set('views', './views') // 过滤器，表示模版放在 ./views 文件下
app.set('view engine', 'ejs')

// 如果没有这个 use 函数的调用，启动服务可能会看到很多的 404 错误，因为我们仅提供了 / 地址下的路由请求，其他任何地址，Node.js都默认转向404错误
app.use(express.static('./public', {
  maxAge: '0', //no cache
  etag: true
}));

// 上面的代码意思是，在public下的文件，包括js,css,images，fonts等都当作静态文件处理，
// 根路径是./public,请求地址就相对于/，比如：./public/js/app.js文件，
// 请求地址就是http://localhost:3000/js/app.js

app.get('/', function (req, res) {
  res.render('index');
});

// Node 模块化初探：
let nodeModule = require('./public/common/utils') // 注意路径书写，似乎 ./ 就表示根目录啊 >.<
console.log(nodeModule.moduleName);