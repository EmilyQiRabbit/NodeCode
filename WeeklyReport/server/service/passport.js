const global = require('../global')
const Utils = require('../helper/utils');
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
  checkLogin: (req, res, data) => {
    const q = Utils.aesEncryption( `token=${data.token}`, global.privateKey )
    return Utils.remotePostJSON( {
      url: global.apis.validateTicket,
      req,
      data: {
        q
      },
      isForm: true
    } ).then( ( body ) => {
      const tempBody = parseJSONStringToObject(Utils.aesDecryption( body, global.privateKey ))
      return Promise.resolve(tempBody)
    } )
  }
}
