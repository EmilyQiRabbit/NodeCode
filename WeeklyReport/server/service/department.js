const moment = require('moment')
const Department = require('../models/Department')
const {promise, toClient, reject, resolve} = require('./serviceCommon')
const departmentService = {
  /**
   * 分页查询部门
   * @param params
   * @returns {*}
   */
  pageQuery: ( params ) => {
    return promise( ( resolve, reject ) => {
      const query = Object.assign({}, params);
      delete query.pageSize;
      delete query.pageNum;
      Department.find(query, (err, doc) => {
        if (err) return reject(err)
        const start = (params.pageNum - 1) * params.pageSize;
        const list = doc.slice(start, start + params.pageSize);
        resolve({
          total: doc.length,
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          list
        })
      })
    })
  },
    /**
   * 查询所有部门
   * @param params
   * @returns {*}
   */
  query: ( params ) => {
    return promise( ( resolve, reject ) => {
      Department.find(params, (err, doc) => {
        if (err) return reject(err)
        resolve({
          total: doc.length,
          list: doc
        })
      })
    })
  },
  /**
   * 更新部门
   * @param params
   * @returns {*}
   */
  updateOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      const update = Object.assign({}, params)
      delete update._id
      Department.findOneAndUpdate({_id: params._id}, update, {new: true}, ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  /**
   * 新增部门
   * @param params
   * @returns {*}
   */
  createOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      Department.create(params, ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  /**
   * 删除部门
   * @param params
   * @returns {*}
   */
  deleteOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      Department.remove(params, ( err ) => {
        if (err) return reject(err)
        resolve(null)
      })
    })
  },
}

module.exports = departmentService
