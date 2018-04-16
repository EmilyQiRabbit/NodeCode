const express = require('express')
const router = express.Router()
const draftService = require('../../service/draft')
const {success, error} = require('../apiCommon')
const {promise} = require('../../service/serviceCommon')
const Promise = require('bluebird')
const moment = require('moment')
const {id} = require('../../global')
/**
 * 创建草稿
 */
router.post('/create', ( req, res, next ) => {
  const {details, messages, userCode, userId} = req.body.report;
  console.log('/create', req.body.report)
  const params = {
    userId,
    userCode,
    details,
    messages
  }
  draftService
  .insertOne(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 查询我的草稿
 */
router.post('/saved', ( req, res, next ) => {
  const {week, year, userId} = req.body
  // 来自于“我”
  const params = {
    userId
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
  console.error(params);
  draftService
  .query(params)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})

module.exports = router
