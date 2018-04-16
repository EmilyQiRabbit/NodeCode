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
 * 根据 ID 删除周报
 */
router.post('/deleteReportById', ( req, res, next ) => {
  const {id} = req.body
  if (!id) {
    return error('请传入 id', res)
  }
  reportService
  .deleteReportById({id})
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 根据 ID 删除 Message
 */
router.post('/deleteMessageById', ( req, res, next ) => {
  const {id} = req.body
  if (!id) {
    return error('请传入 id', res)
  }
  reportService
  .deleteMessageById({id})
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 根据 ID 删除 Detail
 */
router.post('/deleteDetailById', ( req, res, next ) => {
  const {id} = req.body
  if (!id) {
    return error('请传入 id', res)
  }
  reportService
  .deleteDetailById({id})
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})
/**
 * 根据 ID 删除 Detail
 */
router.post('/deleteUserById', ( req, res, next ) => {
  const {id} = req.body
  if (!id) {
    return error('请传入 id', res)
  }
  UserService
  .remove(id)
  .then((results) => {
    success(results, res)
  })
  .catch(err => error(err, res))
})

module.exports = router
  
