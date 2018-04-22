/**
 * 基础的工具方法
 * @type {request}
 */
const request = require('request'); //enable cookie
const logger = require('./mylogger').Logger;
const crypto = require('crypto')

const formatRequestError = function (options) {
  const err = new Error(`获取服务端接口异常，url：${options.url}`);
  return err;
};

const logTimeUse = function (start, url) {
  const end = process.hrtime();
  logger.info(`【${url}】耗时${((end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6).toFixed(3)}ms`);
};

module.exports.remotePostJSON = (options) => {
  const {req = {}} = options;
  const {headers} = req;
  const {clientIP, cookie} = headers;

  logger.info(`POST请求地址:${options.url};请求参数:${JSON.stringify(options.data)}, 携带cookies:${cookie}`);

  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const setting = {
      url: options.url,
      headers: {
        clientIP,
        cookie,
        'X-Requested-With': 'XMLHttpRequest'
      },
    }
    if ( options.isForm ) {
      setting.form = options.data || {}
    } else {
      setting.json = options.data || {}
    }
    request.post(
      setting,
      (err, response, body) => {
        logTimeUse(start, options.url);//记录接口耗时

        if (!err && response.statusCode === 200) {
          // logger.info(`${options.url} =======返回数据========== \n ${JSON.stringify(body, 2)}`);
          logger.info(`${options.url} =======返回数据========== `);
          resolve(body);
        } else {
          if (err) {
            logger.error(`${options.url} =======错误==========  \n ${err.stack}`);
          }
          logger.error(`post:${options.url} error!${response && response.statusCode}`);
          logger.error(`error repsonse body is:${body}`);
          reject(formatRequestError(options));
        }
      }
    );
  });
};

/**
 * get获取json数据
 * @param options
 */
/**
 * get获取json数据
 * @param options
 */
module.exports.remoteGetJSON = (options) => {
  let url;
  if (typeof options === 'string') {
    url = options;
    options = {};
  } else if (typeof options === 'object') {
    url = options.url;
  }

  const {data = {}} = options;
  const {req = {}} = options;
  const {headers} = req;
  const {clientIP, cookie} = headers;

  logger.info(`GET请求地址:${options.url};请求参数:${JSON.stringify(data)},携带cookies:${cookie}`);

  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const setting = {
      url,
      headers: {
        cookie,
        clientIP,
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    if ( options.isForm ) {
      setting.form = data
    } else {
      setting.json = data
    }
    request.get(
      setting,
      (err, response, body) => {
        logTimeUse(start, options.url);//记录接口耗时

        if (!err && response.statusCode === 200) {
          //logger.info(`${options.url} =======返回数据========== \n ${JSON.stringify(body, 2)}`);
          logger.info(`${options.url} =======返回数据==========`);
          resolve(body);
        } else {
          if (err) {
            logger.error(`${options.url} =======错误==========  \n ${err.stack}`);
          }
          logger.error(`post:${options.url} error!${response && response.statusCode}`);
          logger.error(`error repsonse body is:${body}`);
          reject(formatRequestError(options));
        }
      }
    );
  });
};

// 返回客户端 ip
module.exports.getClientIP = function (req) {
  let ipAddress;
  const {headers} = req;
  const forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
  ipAddress = forwardedIpsStr || null;
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

// 首字母大写
module.exports.upperFirstLetter = (str) => {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.substring(1);
}
/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为16位私钥
 * @param iv
 * @returns {string}
 */
module.exports.aesEncryption = ( data, key, iv ) => {
  iv = iv || ''
  const clearEncoding = 'utf8'
  const cipherEncoding = 'base64'
  const cipherChunks = []
  const cipher = crypto.createCipheriv( 'aes-128-ecb', key, iv )
  cipher.setAutoPadding( true )
  cipherChunks.push( cipher.update( data, clearEncoding, cipherEncoding ) )
  cipherChunks.push( cipher.final( cipherEncoding ) )
  return cipherChunks.join( '' )
}
/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为16位私钥
 * @param iv
 * @returns {*}
 */
module.exports.aesDecryption = ( data, key, iv ) => {
  if ( !data ) {
    return ''
  }
  iv = iv || ''
  const clearEncoding = 'utf8'
  const cipherEncoding = 'base64'
  const cipherChunks = []
  const decipher = crypto.createDecipheriv( 'aes-128-ecb', key, iv )
  decipher.setAutoPadding( true )
  cipherChunks.push( decipher.update( data, cipherEncoding, clearEncoding ) )
  cipherChunks.push( decipher.final( clearEncoding ) )
  return cipherChunks.join( '' )
}
