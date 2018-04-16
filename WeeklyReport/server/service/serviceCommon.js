const Promise = require('bluebird')
module.exports = {
  resolve: (data) => {
    return Promise.resolve(data)
  },
  reject: (err) => {
    console.log('promise error --> ', err);
    return Promise.reject(new Error('接口处理失败'))
  },
  toClient: (doc) => {
    if (doc) {
      if (doc instanceof Array) {
        return doc
      }
      const obj = doc.toObject()
      const tempId = obj._id
      delete obj._id
      obj.id = tempId
      return obj
    }
    return null
  },
  promise: ( callback ) => {
    return new Promise(callback)
  }
}
