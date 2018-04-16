/**
 * 用户权限校验
 */

'use strict';

const Promise = require('bluebird');
const UserModel = require('../models/user');
const _ = require('lodash');

const {promise, toClient, reject, resolve} = require('./serviceCommon')


const UserFields = '_id userName email user_status user_role createTime';
const UserFieldsArray = UserFields.split(' ');

module.exports = {

  /**
   * 查询用户是否存在
   */
  getInfo: (options) => {
    return new Promise( (resolve, reject) => {
      UserModel.findOne({email: options.email}, (err, doc) => {
        if ( err ) { 
          return reject(new Error('数据库错误') )
        }
        if ( doc === null) { 
          return resolve({ msg: 'reg' }) 
        }
        resolve(doc);
      })
    })
  },

  /**
   * 查询用户
   * @param params
   * @returns {*}
   */
  queryOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      UserModel.findOne(params)
        .exec( ( err, doc ) => {
          if (err) return reject(err)
          resolve(toClient(doc))
        })
    })
  },

  /**
   * 获取用户全量列表
   *
   */
  getList: (conditions) => {
    return new Promise((resolve, reject) => {
      /**
       * conditions,fields,populate,sort,callback
       */
      UserModel.query( conditions, {user_password: 0, __v: 0}, '', {createTime: 'asc'}, (err, doc) => {
        if ( err ) { 
          reject( new Error('查询数据库错误') ) 
        }
        resolve(doc);
      });
    })
  },

  /**
   * 分页查询用户
   * @param params
   * @returns {*}
   */
  pageQuery: ( params ) => {
    return promise( ( resolve, reject ) => {
      const query = {
      }
      Object.assign(query, params);
      delete query.pageSize;
      delete query.pageNum;
      // 支持通过用户名的模糊查询
      if (query.userName) {
        query.userName = { $regex: query.userName, $options: 'i' };
      }
      //console.error('userPageQuery ==>', query);
      UserModel.find(query, (err, doc) => {
        //console.error('pageQueryResult ==>', doc);
        if (err) return reject(err)
        let list = [];
        if (params.pageNum) {
          const start = (params.pageNum - 1) * params.pageSize;
          list = doc.slice(start, start + params.pageSize);
        } else {
          list = doc;
        }
        resolve({
          total: doc.length,
          pageNum: params.pageNum ? params.pageNum : '',
          pageSize: params.pageSize ? params.pageSize : '',
          list,
        })
      })
    })
  },

  /**
   * 添加用户
   * @param options
   */
  add: (options) => {
    return new Promise((resolve, reject) => {
      UserModel.insertOne(options, (err, doc) => {
        if ( err ) { 
          reject(err); 
        }
        resolve(doc);
      });

    });
  },

  /**
   * 创建用户
   * @param params
   * @returns {*}
   */
  createOne: ( params ) => {
    return promise( ( resolve, reject ) => {
      UserModel.insertOne(params, ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  
  /**
   * 用户信息存入，并将信息返回
   */
  updateInfo: (options) => {
    const _id = options._id;
    const email = options.email;
    return new Promise( (resolve, reject) => {
      const queryObj = _id ? {_id} : {email};
      UserModel.findOneAndUpdate(queryObj, options, (err, doc) => {
        if (err) { 
          reject(err) 
        }
        if (doc == null) { 
          reject(new Error('没有找到该 email'))
        }
        const res = _.pick(doc, UserFieldsArray);
        resolve(res);
      })
    })
  },

  /**
   * 删除用户
   * @param _id
   */
  remove: (_id) => {
    return new Promise( (resolve, reject) => {
      UserModel.findOne({_id}, (err, doc) => {
        if (err) { 
          reject(new Error('数据库错误')) 
        }
        if (doc == null) { 
          reject(new Error('没有找到该ID') )
        }
        UserModel.findAndRemove({_id}, (err, doc) => {
          if (err) { 
            reject(new Error('数据库错误')) 
          }
          if (doc == null) { 
            reject(new Error('没有找到该ID') )
          }
          resolve(doc);
        })
      });
    })
  }

}
