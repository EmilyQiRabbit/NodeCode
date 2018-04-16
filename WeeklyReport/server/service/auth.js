/**
 * 用户权限校验
 */

'use strict';

const Promise = require('bluebird');
const global = require('../global');

const { aesEncryption, aesDecryption, remotePostJSON, remoteGetJSON } = require( '../helper/utils' )
const parseJSONStringToObject = ( jsonString ) => {
  let tempData
  if ( typeof jsonString === 'string' ) {
    try {
      tempData = JSON.parse( jsonString )
    } catch ( err ) {
      tempData = {
        code: 201,
        msg: '返回数据格式异常',
        data: {}
      }
    }
  }
  return tempData
}
module.exports = {

  /**
   * 检查是否登录
   * @param req
   * @returns {*}
   */
  checkLogin: (req) => {
    return new Promise((resolve, reject) => {
      //如果有cookie
      const secret = req.cookies[global.secret]
      if (req.cookies[global.secret]) {
        const q = aesEncryption(`token=${secret}`, global.privateKey)
        remotePostJSON({
          url: global.apis.validateToken,
          req,
          data: {
            q
          },
          isForm: true
        }).then((body) => {
          const data = parseJSONStringToObject(aesDecryption(body, global.privateKey));
          resolve(data)
        }).catch((err) => {
          reject(new Error({
            code: -1,
            msg: err
          }))
        })
      } else {
        resolve({
          code: -1,
          msg: '请登录'
        })
      }
    })
  },

  /**
   * 获取用户数据
   * @returns {*}
   */
  getAuthDetail: (options, req) => {
    return new Promise( (resolve, reject) => {
      const {roleIds, appIds} = options;
      remotePostJSON({
        url: global.apis.getAuthority,
        req,
        data: {
          roleIds,
          appIds
        }
      }).then((doc) => {
        if (doc.code === 200) {
          resolve(doc)
        } else {
          reject(doc)
        }
      }).catch((err) => {
        reject(Error({
          code: 0,
          msg: err
        }))
      })
    })
  }
}
