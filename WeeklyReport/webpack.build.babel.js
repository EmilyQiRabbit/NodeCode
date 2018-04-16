
//需要使用的webpack配置文件
let realFileName = './webpack.config.prod.babel';

//检测是否定义了环境变量,没有定义,使用默认的development
if (process.env.NODE_ENV === undefined) {
  console.log('NODE_ENV is undefind! use default [development].');
  process.env.NODE_ENV = 'development';
}
if (process.env.NODE_ENV === 'development') {
  realFileName = './webpack.config.dev.babel';
}

console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}.`);
console.log(`use webpack config file :"${realFileName}"`);

const options = require('./Config');

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
if (process.env.NODE_ENV === 'development') {
  for (const i in options.entry) {
    if (i !== 'vendor') {
      options.entry[i].push(hotMiddlewareScript);
    }
  }
}

const config = require(realFileName)(options);
module.exports = config;
