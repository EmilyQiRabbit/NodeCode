/**
 * 入口文件
 */

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./helper/mylogger').Logger;
const {getClientIP} = require('./helper/utils');
const errorHandler = require('./helper/errorHandler');

global.config = require('./global'); //加载global配置

const isDev = process.env.NODE_ENV === 'development';
const isLocal = process.env.LOCAL_DEV;
const app = express();

logger.info(`process.env.NODE_ENV is [${process.env.NODE_ENV}]`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json({limit: '20mb'}));//设置前端post提交最大内容
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
app.use(bodyParser.text());
app.use(cookieParser());
app.use(require('./helper/requestLogger').create(logger));

app.use('/public', express.static(path.join(__dirname, '../public')));

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const DB_URL = process.env.DB_URL;
//session信息存储到数据库
app.use(session({
  secret: 'session-secret',
  saveUninitialized: true,
  cookie: {
    // maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    maxAge: 1000 * 60 * 60 * 8, //8hour 与cookie过期时间相同
  },
  store: new MongoStore({
    url: DB_URL,
    collection: 'sessions'
  }),
  resave: true
}));

try {
  console.log('准备链接DB：' + DB_URL);
  // var db = mongoose.createConnection();
  // db.openSet(config.dbUrl);
  mongoose.connection.on('open', function () {
    console.log('连接数据库成功');

  });

  mongoose.connection.on('error', function (err) {
    console.log('连接数据库失败');
  });
  mongoose.Promise = require('bluebird'); //fix DeprecationWarning: Mongoose: mpromise  http://mongoosejs.com/docs/promises.html
  mongoose.connect(DB_URL);

} catch (e) {
  console.log('数据库链接失败：', e);
}

if (isDev && isLocal) {
  const webpackConfig = require('../webpack.build.babel');
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, //如果设置该参数为 true，则不打印输出信息
    cache: true, //开启缓存，增量编译
    stats: {
      colors: true, //打印日志显示颜色
      reasons: true //打印相关被引入的模块
    },
    publicPath: webpackConfig.output.publicPath
  }));

  //热部署，自动刷新，需要结合 webpack.config.dev.babel 中的定义
  app.use(require('webpack-hot-middleware')(compiler, {
    log: logger.info,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
}

//get client IP
app.use((req, res, next) => {
  req.headers.clientIP = getClientIP(req);
  next();
});

// load routers
require('./boot')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  //不处理 map 和 json 格式的数据
  if (/\.(map|json)$/.test(req.url)) {
    return next();
  }
  const err = new Error(`${req.url},Not Found`);
  err.status = 404;
  next(err);
});

// error handlers
// will print stacktrace
app.use((err, req, res, next) => {
  if (req.url.startsWith('/api')) {
    const msg = errorHandler(err);
    return res.status(200).json({
      code: err.code || 'E-50x',
      msg
    });
  }

  // logger.error(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message || 'error',
    error: err
  });
});

module.exports = app;
