/**
 * 分类模块
 */

'use strict';

const Promise = require('bluebird');
const TermModel = require('../models/term');

module.exports = {
  /**
   * 获取列表
   */
  getList: (type = '') => {
    const formdata = {};
    if (type) {
      formdata.term_type = type
    }
    return new Promise((resolve, reject) => {
      TermModel.finds(formdata, (err, doc) => {
        if ( err ) {
          reject( new Error('查询数据库错误'))
        }
        resolve(doc);
      });
    })
  },

  /**
   * 添加分类
   * @param options
   */
  add: (options) => {
    return new Promise((resolve, reject) => {
      TermModel.insertOne(options, (err, doc) => {
        if ( err ) { 
          reject(err) 
        }
        resolve(doc);
      });
    });
  },

  /**
   * 修改分类信息
   */
  updateInfo: (options) => {
    const _id = options._id;
    return new Promise( (resolve, reject) => {
      TermModel.findAndUpdate({_id}, options, (err, doc) => {
        if (err) { 
          reject(err) 
        }
        if (doc == null) { 
          reject(new Error('没有找到该ID') )
        }
        resolve(doc);
      })
    })
  },

  /**
   * 删除分类
   * @param _id
   */
  remove: (_id) => {
    return new Promise( (resolve, reject) => {
      TermModel.findAndRemove( {_id}, (err, doc) => {
        if (err) { 
          reject( new Error('数据库错误')) 
        }
        if (doc == null) {
          reject(new Error('没有找到该ID')) 
        }
        resolve(doc);
      })
    })
  }

}