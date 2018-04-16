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
  getList : function (type = '') {
    const formdata = {};
    if (type) {
      formdata.term_type = type
    }
    return new Promise(function(resolve, reject){
      TermModel.finds(formdata, (err, doc) => {
        if ( err ) {reject('查询数据库错误')}
        resolve(doc);
      });
    })
  },

  /**
   * 添加分类
   * @param options
   */
  add: function (options) {
    return new Promise(function(resolve, reject){
      TermModel.insertOne(options, (err, doc) => {
        if ( err ) { reject(err) }
        resolve(doc);
      });
    });
  },

  /**
   * 修改分类信息
   */
  updateInfo: function(options) {
    const _id = options._id;
    return new Promise(function (resolve, reject) {
      TermModel.findAndUpdate({_id:_id}, options, function (err, doc) {
        if(err){ reject(err) }
        if(doc == null) { reject('没有找到该ID') }
        resolve(doc);
      })
    })
  },

  /**
   * 删除分类
   * @param _id
   */
  remove: function(_id){
    return new Promise(function (resolve, reject) {
      TermModel.findAndRemove({_id:_id},function (err, doc) {
        if(err){ reject('数据库错误') }
        if(doc == null) { reject('没有找到该ID') }
        resolve(doc);
      })
    })
  }

}