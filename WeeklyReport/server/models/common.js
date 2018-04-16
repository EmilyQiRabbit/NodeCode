'use strict';

const mongoose = require('mongoose');
const async = require('async');

const dataApi = (schemObj, objName) => {

    //const _model = mongoose.model(objName, schemObj);

    /**
     * 插入数据
     * @param obj
     * @param callback
     */
    schemObj.statics.addMultiple = (obj, callback) => {
      const _Model = mongoose.model(objName, schemObj);
        _Model.create(obj, (err, doc) => {
          callback(err, doc);
        });
    }

  /**
   * 插入数据
   * @param obj
   * @param callback
   */
  schemObj.statics.insertOne = (obj, callback) => {
    const _Model = mongoose.model(objName, schemObj);
    const entity = new _Model(obj);
    entity.save( (err, newObj) => {
        callback(err, entity);
    });
  }

  /**
   * 更新数据
   * @param conditions
   * @param update
   * @param callback
   */
    schemObj.statics.findAndUpdate = (conditions, update, callback) => {
        if (!conditions || conditions === {}) {
            throw new Error('更新条件不能为空');
        }
        mongoose.model(objName, schemObj).findOneAndUpdate(conditions, update, { new: true,  runValidators: true }, (err, doc) => {
            callback(err, doc);
        });
    };

    /**
     * 删除数据
     * @param conditions
     * @param callback
     */
    schemObj.statics.findAndRemove = (conditions, callback) => {
       if (!conditions || conditions === {}) {
           throw new Error('删除条件不能为空');
       }
        mongoose.model(objName, schemObj).findOneAndRemove(conditions, (err, doc) => {
            callback(err, doc);
        })
    };

    schemObj.statics.finds = (conditions, callback) => {
      mongoose.model(objName, schemObj).find(conditions, (err, doc) => {
          if (err) {
              throw err;
          } else {
              callback(err, doc);
          }
      })
    };

  /**
   * 分页查询
   * @param page
   * @param pageSize
   * @param queryParams
   * @param queryFields
   * @param populate
   * @param sortParams
   * @param callback
   */
  schemObj.statics.pageQuery = (page = 1, pageSize, queryParams = {}, queryFields = {}, populate = '', sortParams, callback) => {

    const start = (page - 1) * pageSize;
    const _Model = mongoose.model(objName, schemObj);
    const $page = {};

    async.parallel({
      count: (done) => {  // 查询数量
        _Model.count(queryParams).exec((err, count) => {
          done(err, count);
        });
      },
      records: (done) => {   // 查询一页的记录
        if (populate) {
          _Model.find(queryParams, queryFields).populate(populate).skip(start).limit(pageSize).sort(sortParams).exec( (err, doc) => {
            done(err, doc);
          });
        } else {
          _Model.find(queryParams, queryFields).skip(start).limit(pageSize).sort(sortParams).exec( (err, doc) => {
            done(err, doc);
          });
        }
      }
    }, (err, results) => {
      $page.pagination = {
        current: Number(page),
        pageSize,
        total: results.count
      };
      $page.results = results.records;
      callback(err, $page);
    });
  };

  /**
   * 全量查询
   * @param queryParams
   * @param queryFields
   * @param populate
   * @param sortParams
   * @param callback
   */
  schemObj.statics.query = (queryParams = {}, queryFields = {}, populate = '', sortParams, callback) => {
    const $page = {};
    const _Model = mongoose.model(objName, schemObj);

    async.parallel({
      count: (done) => {  // 查询数量
        _Model.count(queryParams).exec( (err, count) => {
          done(err, count);
        });
      },
      records: (done) => {   // 查询一页的记录
        if (populate) {
          _Model.find(queryParams, queryFields).populate(populate).sort(sortParams).exec( (err, doc) => {
            done(err, doc);
          });
        } else {
          _Model.find(queryParams, queryFields).sort(sortParams).exec( (err, doc) => {
            done(err, doc);
          });
        }
      }
    }, (err, results) => {
      $page.total = results.count;
      $page.results = results.records;
      callback(err, $page);
    });
  };

}
module.exports = dataApi
