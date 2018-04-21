/**
 * Created by Emily on 2018/1/31.
 */
const Draft = require('../models/Draft')
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
const draftService = {
  /**
   * 查询当前草稿
   * @param params
   * @returns {Promise|Promise.<TResult>}
   */
  query: (params) => { // params => userCode, year, week
    // 查询我收到的消息
    return promise( ( resolve, reject ) => {
      Draft.findOne({userId: params.userId, year: params.year, week: params.week})
      .populate('details')
      .populate('sendTo')
      .populate('copyTo')
      .populate('userId')
      .exec( ( err, doc ) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
    // 整理数据格式 分页返回
    .then((draft) => {
      //const start = (query.pageNum - 1) * query.pageSize
      return Promise.resolve({
        total: 1,
        list: [draft]
      })
    })
    .catch(err => Promise.reject(err))
  },
  /**
   * 新建一个 或者修改原有
   * @param params
   * @returns {bluebird}
   */
  insertOne: ( params ) => {
    //console.error('insertOne params ---------> ', params);
    const week = moment().weeks()
    const year = moment().year()
    return promise( ( resolve, reject ) => { // Checking if already existed a report this week, if do exist, change it
      Draft.findOne({
        userId: params.userId,
        week,
        year
      })
      .exec( ( err, doc ) => {
        if (err) return reject(err)
        resolve(doc)
      })
    })
    .then((doc) => {
      return promise((resolve, reject) => {
        if (doc) { // exist a draft, then that user cant create a new report this week.
          //console.log('exist a draft -->', doc)
          if (doc.details instanceof Array) {
            doc.details.forEach( (detail) => {
              Details.findOne({_id: detail}).exec( (err, detailDoc) => {
                if (err) return reject(err)
                detailDoc.remove()
              })
            })
          }
          doc.remove()
        }
        // now deal with messages
        const messageArray = params.messages || [];
        //console.error('messageArray ===> ', messageArray);
        const sendTo = [], copyTo = [];
        messageArray.forEach((message) => {
          if (message.type === 0) { // 0:主送，1:抄送
            sendTo.push(message.to)
          } else {
            copyTo.push(message.to)
          }
        })
        Draft.create({
          userId: params.userId,
          week,
          year,
          details: [],
          sendTo,
          copyTo
        }, ( err, newDraft ) => {
          if (err) return reject(err)
          const draft = toClient(newDraft);
          // reportId is required for a detail, so we must create report first, and create detail in the callbackFunc
          const detailArray = params.details || [];
          detailArray.forEach((detail) => {
            Details.create({
              reportId: draft.id,
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
              Draft.findById(draft.id, (err, report) => {
                console.log(err);
                report.details.push(newDetail.id);
                report.markModified('details');
                report.save();
              })
            })
          })
          return resolve(draft)
        })
      })
    })
    .catch(err => Promise.reject(err))
  },
}

module.exports = draftService
