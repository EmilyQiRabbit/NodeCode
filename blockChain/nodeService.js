// 这个是官网的例子，是一个完整的web应用。
// 也可以理解为一个服务器软件，它在 8080 端口，提供了一个简单的web服务。
// 运行它需要在控制台输入：node fileName.js

var express = require('express');
var app = express();

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.set('views', './views')
app.set('view engine', 'ejs')

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
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