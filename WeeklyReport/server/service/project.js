/**
  * project.js
  * 
  */
const moment = require('moment')
const Project = require('../models/Project')
const {promise, toClient, reject, resolve} = require('./serviceCommon')
const projectService = {
  /**
   * 分页查询项目
   * @param params
   * @returns {*}
   */
  queryAll: ( params ) => {
    return promise( ( resolve, reject ) => {
      // 支持通过项目名的模糊查询
      if (params.projectName) {
        params.projectName = { $regex: params.projectName, $options: 'i' };
      }
      // 查找
      Project.find(params, (err, doc) => {
        if (err) return reject(err)
        resolve({
          total: doc.length,
          list: doc
        })
      })
    })
  },

  /**
   * 更新项目
   * @param params
   * @returns {*}
   */
  updateOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      const update = Object.assign({}, params)
      delete update._id
      Project.findOneAndUpdate({_id: params._id}, update, {new: true}, ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  /**
   * 新增项目
   * @param params
   * @returns {*}
   */
  createOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      Project.create(params, ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  /**
   * 删除项目
   * @param params
   * @returns {*}
   */
  deleteOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      Project.remove(params, ( err ) => {
        if (err) return reject(err)
        resolve(null)
      })
    })
  },
}

module.exports = projectService
