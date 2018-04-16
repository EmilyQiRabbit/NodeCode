const express = require('express')
const router = express.Router()
const reportService = require('../../service/report')
const UserService = require('../../service/user')
const {success, error} = require('../apiCommon')
const {promise} = require('../../service/serviceCommon')
const Promise = require('bluebird')
const moment = require('moment')
const {id} = require('../../global')
/**
 * 分页查询周报
 */
router.post('/query',  ( req, res, next ) => {
  const {projectName, pageSize, pageNum, week, year} = req.body
  req.session.user = {
    id
  }
  console.error(req.body);
  const params = {
    //to: req.session.user.id
  }
  // 不确定是查询发送的周报还是接受的周报，因此在这里不做限制
  params.pageSize = isNaN(Number(pageSize)) ? 10 : Number(pageSize)
  params.pageNum = isNaN(Number(pageNum)) ? 1 : Number(pageNum)
  if (!isNaN(Number(week))) {
    params.week = Number(week)
  }
  if (!isNaN(Number(year))) {
    params.year = Number(year)
  }
  if (projectName) {
    params.projectName = projectName
  }
  reportService
  .pageQuery(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 创建周报
 */
router.post('/create', ( req, res, next ) => {
  const {details, messages, email, userId, status} = req.body.report;
  const params = {
    userId,
    email,
    details,
    messages,
    status
  }
  reportService
  .insertOne(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 我收到的周报
 * 区分 主收 和 抄送
 */
router.post('/received', ( req, res, next ) => {
  const {week, year, type, projectName, to} = req.body
  const params = {
    projectName,
    to
  }
  if (isNaN(Number(week))) {
    params.week = moment().weeks()
  } else {
    params.week = Number(week)
  }
  if (isNaN(Number(year))) {
    params.year = moment().year()
  } else {
    params.year = Number(year)
  }
  params.status = 1; // 已发送
  reportService
  .queryAll(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 我发起的周报
 */
router.post('/sended', ( req, res, next ) => {
  req.session.user = {
    id
  }
  const {week, year, type, projectName, from} = req.body
  // 来自于“我”
  const params = {
    projectName,
    from
  }
  // set week and year
  if (isNaN(Number(week))) {
    params.week = moment().weeks()
  } else {
    params.week = Number(week)
  }
  if (isNaN(Number(year))) {
    params.year = moment().year()
  } else {
    params.year = Number(year)
  }
  // no limit for the value of "type" key
  params.status = 1; // 已发送
  console.error(params);
  reportService
  .queryAll(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})


/**
 * 我保存的周报
 */
router.post('/saved', ( req, res, next ) => {
  req.session.user = {
    id
  }
  const {from} = req.body
  // 来自于“我”
  const params = {
    from
  }
  // set week and year
  params.week = moment().weeks()
  params.year = moment().year()
  params.status = 0; // 未发送
  console.log(params);
  reportService
  .pageQuery(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 查询周报详情
 */
router.post('/detail', ( req, res, next ) => {
  const {reportId} = req.body
  if (!reportId) {
    return error('请传入reportId', res)
  }
  reportService
  .queryOne({reportId})
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 获取未读周报数
 * 默认当前周，年
 */
router.post('/getUnread', ( req, res, next ) => {
  const {type, week, year} = req.body
  const params = {
    to: req.session.user.id,
    status: 0, //0未读 1已读
  }
  const _type = Number(type)
  let errorMsg = ''
  if (isNaN(_type)) {
    errorMsg = 'type参数类型不正确'
  } else if (_type !== 1 && _type !== 0) {
    errorMsg = 'type参数为0或者1'
  } else {
    params.type = _type
  }
  if (errorMsg) return error(errorMsg, res)

  const _week = Number(week || moment().weeks()),
    _year = Number(year || moment().year())
  if (isNaN(_week)) {
    errorMsg = 'week参数类型不正确'
  } else {
    params.week = _week
  }
  if (isNaN(_year)) {
    errorMsg = 'year参数类型不正确'
  } else {
    params.year = _year
  }
  if (errorMsg) return error(errorMsg, res)
  reportService
  .countMessage(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 设置为已读
 */
router.post('/setRead', ( req, res, next ) => {
  const {reportId, messageId} = req.body
  let errorMsg = ''
  if (!reportId || !messageId) {
    errorMsg = '请传入reportId和messageId'
  }
  if (errorMsg) return error(errorMsg, res)

  reportService
  .findAndUpdateMessage({
    reportId,
    messageId,
    status: 1
  })
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 创建项目详情
 */
router.post('/createDetail', ( req, res, next ) => {
  const params = {
    userId: req.session.user.id
  }
  const {reportId, content, projectId, projectName, type} = req.body
  let errorMsg = ''
  if (!reportId) {
    errorMsg = '请传入reportId'
  }
  if (!projectId) {
    errorMsg = '请传入projectId'
  }
  if (!projectName) {
    errorMsg = '请传入projectName'
  }
  const _type = Number(type)
  if (isNaN(_type)) {
    errorMsg = 'type类型不正确'
  } else if (_type !== 0 && _type !== 1) {
    errorMsg = 'type取值为0或者1'
  }
  if (errorMsg) return error(errorMsg, res)
  Object.assign(params, {
    reportId,
    content,
    projectId,
    projectName,
    type
  })
  reportService
  .insertDetail(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 更新详情
 */
router.post('/updateDetail', ( req, res, next ) => {
  const {detailId, content} = req.body
  let errorMsg = ''
  if (!detailId) {
    errorMsg = 'detailId不能为空'
  }
  if (content === undefined) {
    errorMsg = '请传入content'
  }
  if (errorMsg) return error(errorMsg, res)
  reportService
  .updateDetail({
    detailId,
    content
  })
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 删除详情
 */
router.post('/deleteDetail', ( req, res, next ) => {
  const {detailId} = req.body
  let errorMsg = ''
  if (!detailId) {
    errorMsg = 'detailId不能为空'
  }
  if (errorMsg) return error(errorMsg, res)
  reportService
  .removeOneDetail({
    _id: detailId
  })
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 发送周报
 */
router.post('/send', ( req, res, next ) => {
  const {to, reportId} = req.body
  const userId = req.session.user.id
  let errorMsg = ''
  if (!(to instanceof Array)) {
    errorMsg = 'to类型不正确'
  }
  if (!reportId) {
    errorMsg = 'reportId不能为空'
  }
  if (errorMsg) return error(errorMsg, res)

  const messages = to.map( ( item, index ) => {
    return {
      from: userId,
      status: 0,
      to: item.id,
      type: item.type,
      reportId,
      week: moment().weeks(),
      year: moment().year()
    }
  })
  reportService
  .insertMessages(messages)
  .then( ( results ) => {
    const messages = results.map( ( item, index ) => {
      return item._id
    })
    return Promise.resolve(messages)
  })
  .then((messages) => {
    return reportService.updateReport({
      reportId,
      messages,
      status: 1
    })
  })
  .then(( results ) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
module.exports = router
  
