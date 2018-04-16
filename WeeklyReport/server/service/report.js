/**
 * Created by Emily on 2017/9/12.
 */
const Report = require('../models/Report')
const User = require('../models/user')
const Details = require('../models/Detail')
const Message = require('../models/Message')
const Project = require('../models/Project')
const Promise = require('bluebird');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Number, String} = Schema.Types
const {resolve, reject, toClient, promise} = require('./serviceCommon')
const moment = require('moment')
const contentLength = 40
const reportService = {
  /**
   * 查询
   * @param params
   * @returns {Promise|Promise.<TResult>}
   */
  queryAll: (params) => {
    let query = {}
    query = Object.assign({}, params)
    delete query.projectName
    delete query.status
    // 查询我收到的消息
    return promise( ( resolve, reject ) => {
      const userQuery = {
        email: query.to || query.from || ''// We use email to query userId
      }
      User.find(userQuery)
      .exec( ( err, userDocs ) => {
        if (err) return reject(err)
        resolve(userDocs)
      })
    })
    .then((userDocs) => {
      return promise( ( resolve, reject ) => {
        if (query.to) query.to = userDocs[0] ? userDocs[0]._id : '';
        if (query.from) query.from = userDocs[0] ? userDocs[0]._id : '';
        Message.find(query)
        .populate('reportId')
        .populate('from')
        .populate('to')
        .exec( ( err, messageDocs ) => {
          if (err) return reject(err)
          resolve(messageDocs)
        })
      })
    })
    // 根据消息查询每一个收到的report: one point we should notice is that, one report might has many messages, so we need to filter the result. 
    .then((messageDocs) => {
      console.log('messageDocs ==>', messageDocs);
      const results = messageDocs.map((item, index) => {
        return promise( ( resolve, reject ) => {
          Report.findOne({_id: item.reportId._id, status: params.status})
          .populate('details')
          .populate({ // the populate syntax do with multilevel
            path: 'messages',
            populate: { path: 'to' }
          })
          .populate('userId')
          .exec( ( err, doc ) => {
            if (err) return reject(err)
            resolve(doc)
          })
        })
      })
      return Promise.all(results)
    })
    //从收到的report中过滤包含指定项目的report
    .then((reports) => {
      // do filter
      const map = {};
      const filterReports = [];
      reports.forEach( (report) => {
        if (report && !map[report.id]) {
          filterReports.push(report);
          map[report.id] = true;
        }
      })
      if (params.projectName === undefined || params.projectName === '') {
        return Promise.resolve(filterReports);
      }
      const finalResults = [];
      filterReports.forEach( ( item, index ) => {
        let flag = false, content = ''
        for (let i = 0; i < item.details.length; i++) {
          const detail = item.details[i]
          //筛选数据
          item.details[i] = {
            id: detail._id,
            projectId: detail.projectId,
            projectName: detail.projectName,
            content: detail.content
          }
          //匹配项目名称 关键点
          if ( detail.projectName.indexOf(params.projectName) > -1) {
            flag = true
            content = detail.content.substring(0, contentLength)
          }
        }
        if (flag) {
          //筛选数据
          item = toClient(item)
          item.reportId = item.id
          delete item._id
          item.from = {
            id: item.userId._id,
            email: item.userId.email,
            userName: item.userId.userName,
            nickName: item.userId.nickName
          }
          //delete item.userId
          finalResults.push(Object.assign({content}, item));
        } 
      })
      console.log('筛选符合条件的周报------>', finalResults)
      return Promise.resolve(finalResults);
    })
    // 整理数据格式 返回
    .then((reports) => {
      return Promise.resolve({
        total: reports.length,
        list: reports
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 新建一个 并返回新建内容
   * @param params
   * @returns {bluebird}
   */
  insertOne: ( params ) => {
    console.error('insertOne params ---------> ', params);
    const week = moment().weeks()
    const year = moment().year()
    return promise( ( resolve, reject ) => { // Checking if already existed a report this week, if do exist, change it
      Report.findOne({
        userId: params.userId,
        week,
        year
      })
      .populate('details')
      .populate('messages')
      .exec( ( err, doc ) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
    .then((doc) => {
      return promise((resolve, reject) => {
        if (doc) { // exist a report, then that user cant create a new report this week.
          console.log('exist a report -->', doc)
          if (doc.details instanceof Array) {
            doc.details.forEach( (detail) => {
              Details.findOne({_id: detail._id}).exec( (err, detailDoc) => {
                if (err) return reject(err)
                detailDoc.remove()
              })
            })
          }
          if (doc.messages instanceof Array) {
            doc.messages.forEach( (message) => {
              Message.findOne({_id: message._id}).exec( (err, messageDoc) => {
                if (err) return reject(err)
                messageDoc.remove()
              })
            })
          }
          doc.remove()
        }
        const userQuery = {
          email: params.email// We use email to query userId
        }
        User.find(userQuery)
        .exec( ( err, userDocs ) => {
          if (err) return reject(err)
          resolve(userDocs)
          console.error('userDocs --> ', userDocs)
          params.userId = userDocs[0]._id;
          // Now we have userId, then we can create a new report.
          Report.create({
            userId: params.userId,
            week,
            year,
            status: params.status,
            details: [],
            messages: []
          }, ( err, doc ) => {
            if (err) return reject(err)
            const newReport = toClient(doc);
            // reportId is required for a detail, so we must create report first, and create detail in the callbackFunc
            const detailArray = params.details || [];
            detailArray.forEach((detail) => {
              Details.create({
                reportId: newReport.id,
                userId: params.userId,
                projectId: detail.projectId,
                projectName: detail.projectName,
                content: detail.content,
                type: detail.type,
                week,
                year,
              }, (err, detailDoc) => {
                console.log(err);
                const newDetail = toClient(detailDoc);
                Report.findById(newReport.id, (err, report) => {
                  console.log(err);
                  report.details.push(newDetail.id);
                  report.markModified('details');
                  report.save();
                })
              })
            })
            // now deal with messages
            const messageArray = params.messages || [];
            console.error('messageArray ===> ', messageArray);
            messageArray.forEach((message) => {
              const userQuery = {
                _id: message.to
              }
              User.find(userQuery)
              .exec( ( err, userDocs ) => {
                console.log(err);
                Message.create({
                  reportId: newReport.id,
                  status: 0,
                  from: params.userId,
                  to: userDocs[0]._id,
                  type: message.type,
                  week,
                  year,
                }, (err, messageDoc) => {
                  console.log(err);
                  const newMessage = toClient(messageDoc);
                  Report.findById(newReport.id, (err, report) => {
                    console.log(err);
                    report.messages.push(newMessage.id);
                    report.markModified('messages');
                    report.save();
                  })
                })
              })
            })
            //obj.details = handleFnc(obj.details)
            return resolve(newReport)
          })
        })
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 更新周报
   * @param params
   * @returns {bluebird}
   */
  updateReport: (params) => {
    return promise( ( resolve, reject ) => {
      const update = Object.assign({
        updateTime: Date.now()
      }, params)
      delete update.reportId
      Report.findOneAndUpdate({
        _id: params.reportId
      }, update, ( err, doc ) => {
        if (err) reject(err)
        resolve(null)
      })
    })
  },
  /**
   * 查询周报
   * @param params
   * @returns {bluebird}
   */
  query: ( params ) => {
    const query = Object.assign({}, params)
    return promise( ( resolve, reject ) => {
      Message.find(query)
      .populate('reportId')
      .populate('from')
      .exec( ( err, docs ) => {
        if (err) return reject(err)
        resolve(docs)
      })
    })
    .then((docs) => {
      const results = docs.map( ( item, index ) => {
        return promise( ( resolve, reject ) => {
          Report.findOne({
            _id: item.reportId._id
          })
          .populate('details')
          .populate('userId')
          .exec((err, doc) => {
            if (err) reject(err)
            //消息状态 已读未读
            doc.status = item.status
            resolve(doc)
          })
        })
      })
      return Promise.all(results)
    })
    .then((data) => {
      //所有的周报
      const results = data.map((value, index) => {
        //每个周报的项目内容
        const projects = value.details.map( ( item, index ) => {
          return {
            projectId: item.projectId,
            projectName: item.projectName,
            type: item.type
          }
        })
        const content = value.details.length > 0 ? `${value.details[0].content.substring(0, contentLength)}...` : ''
        return {
          reportId: value._id,
          from: {
            userId: value.userId._id,
            userName: value.userId.userName
          },
          time: value.updateTime,
          status: value.status,
          projects,
          content
        }
      })
      return Promise.resolve({
        list: results
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 查询周报内容
   * @param params
   * @returns {bluebird}
   */
  queryOne: ( params ) => {
    const query = Object.assign({
      _id: params.reportId
    }, params)
    let finalDoc = {}
    delete query.reportId
    return promise( ( resolve, reject ) => {
      Report.findOne(query)
      .populate('details')
      .populate('messages')
      .populate('userId')
      .exec( ( err, doc ) => {
        if (err) reject(err)
        resolve(doc)
      })
    })
    .then((doc) => {
      const from = {
        userId: doc.userId._id,
        userName: doc.userId.userName
      }
      const list = doc.details.map((item, index) => {
        const temp = toClient(item)
        delete temp.userId
        delete temp.reportId
        return temp
      })
      const queryUsers = doc.messages.map( ( item, index ) => {
        return promise( ( resolve, reject ) => {
          User.findOne({
            _id: item.to
          })
          .exec( ( err, doc ) => {
            if (err) return reject(err)
            doc.msgType = item.type
            resolve(doc)
          })
        })
      })
      doc.from = from
      doc.list = list
      finalDoc = doc
      return Promise.all(queryUsers)
    })
    .then((users) => {
      const {week, year, updateTime, createTime, status, from, list} = finalDoc
      const to = users.map( ( value, index ) => {
        return {
          userId: value._id,
          userName: value.userName,
          type: value.msgType
        }
      })
      return Promise.resolve({
        reportId: params.reportId,
        status,
        from,
        to,
        year,
        week,
        list,
        createTime,
        updateTime
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 查询消息数
   * @param params
   * @returns {bluebird}
   */
  countMessage: ( params ) => {
    return promise( ( resolve, reject ) => {
      Message.find(params, ( err, docs ) => {
        if (err) return reject(err)
        resolve({count: docs.length})
      })
    })
  },
  /**
   * 更新消息状态
   * @param params
   */
  findAndUpdateMessage: ( params ) => {
    return promise( ( resolve, reject ) => {
      Message.findOneAndUpdate({
        reportId: params.reportId,
        _id: params.messageId
      }, {
        status: params.status,
        updateTime: Date.now()
      },  ( err, doc ) => {
        if (err) return reject(err)
        resolve(toClient(doc))
      })
    })
  },
  /**
   * 生成一条消息
   * @param params
   * @returns {bluebird}
   */
  insertOneMessage: ( params ) => {
    return promise( ( resolve, reject ) => {
      Message.create(params).exec( ( err, doc ) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
  },
  /**
   * 批量生成消息
   * @param params
   * @returns {bluebird}
   */
  insertMessages: ( array ) => {
    return promise( ( resolve, reject ) => {
      Message.create(array, ( err, docs ) => {
        if (err) return reject(err)
        resolve(docs)
      })
    })
  },
  /**
   * 插入一条详情
   * @param params
   * @returns {bluebird}
   */
  insertDetail: (params) => {
    const {reportId, projectId, projectName, type} = params
    return promise(( resolve, reject ) => {
      Details.findOne({
        reportId,
        projectId,
        projectName,
        type
      }).exec(( err, doc ) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
    .then((doc) => {
      if (doc) {
        return Promise.reject(new Error('已存在此项目记录'))
      }
      return Promise.resolve(doc)
    })
    .then((doc) => {
      const week = moment().weeks()
      const year = moment().year()
      const createParams = Object.assign({}, {
        week,
        year
      }, params)
      return promise((resolve, reject) => {
        Details.create(createParams, ( err, doc ) => {
          if (err) return reject(err)
          return resolve(doc)
        })
      })
    })
    .then((doc) => {
      const detail = doc
      return promise((resolve, reject) => {
        Report.findOne({
          _id: reportId
        })
        .exec(( err, doc ) => {
          if (err) return reject(err)
          const details = doc.details.concat([detail._id])
          resolve(details)
        })
      })
    })
    .then((details) => {
      return this.updateReport({
        reportId,
        details
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 更新一条详情
   * @param params
   */
  updateDetail: ( params ) => {
    return promise( ( resolve, reject ) => {
      const {detailId} = params
      Details.findOneAndUpdate({
        _id: detailId
      }, {
        content: params.content,
        updateTime: Date.now()
      }, ( err, doc ) => {
        if (err) return reject(err)
        if (!doc) return reject('该记录不存在')
        resolve(null)
      })
    })
  },
  /**
   * delete
   * @param params
   */
  deleteDetailById: ( params ) => {
    return promise( ( resolve, reject ) => {
      Details.findOne({
        _id: params.id
      }, ( err, doc ) => {
        if (err) return reject(err)
        if (doc) {
          doc.remove()
          resolve('成功')
        }
        reject('未找到')
      })
    })
  },
    /**
   * delete
   * @param params
   */
  deleteMessageById: ( params ) => {
    console.log('deleteMessageById ==>', params)
    return promise( ( resolve, reject ) => {
      Message.findOne({
        _id: params.id
      }, ( err, doc ) => {
        if (err) return reject(err)
        console.log('deleteMessageById ==>', doc)
        if (doc) {
          doc.remove()
          resolve('成功')
        }
        reject('未找到')
      })
    })
  },
    /**
   * delete
   * @param params
   */
  deleteReportById: ( params ) => {
    return promise( ( resolve, reject ) => {
      Report.findOne({
        _id: params.id
      }, ( err, doc ) => {
        if (err) return reject(err)
        if (doc) {
          doc.remove()
          resolve('成功')
        }
        reject('未找到')
      })
    })
  },
  /**
   * 删除详情
   * @param params
   * @returns {bluebird}
   */
  removeOneDetail: ( params ) => {
    return promise( ( resolve, reject ) => {
      Details.findOne(params)
      .populate('reportId')
      .exec( ( err, doc ) => {
        if (err) return reject(err)
        //如果周报已发送，不允许删除
        if (!doc || doc.reportId.status === 1) return reject(new Error('该记录不存在或者处于已发送状态'))
        resolve(doc)
      })
    })
    .then((doc) => {
      return promise( ( resolve, reject ) => {
        Details.remove(params, ( err ) => {
          if (err) return reject(err)
          const index = doc.reportId.details.indexOf(params._id)
          if (index >= 0) {
            doc.reportId.details.splice(index, 1)
          } else {
            return reject(err)
          }
          resolve(doc)
        })
      })
    })
    .then((doc) => {
      return promise((resolve, reject) => {
        Report.findOneAndUpdate({
          _id: doc.reportId._id
        }, {
          details: doc.reportId.details,
          updateTime: Date.now()
        }, ( err, doc ) => {
          if (err) return reject(err)
          resolve(null)
        })
      })
    })
    .catch(err => reject(err))
  },
}

module.exports = reportService
