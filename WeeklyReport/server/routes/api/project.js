/**
 * project.js
 * 
 */
const projectService = require('../../service/project')
const express = require('express')
const router = express.Router()
const {success, error} = require('../apiCommon')
const {id} = require('../../global')

/**
 * 查询所有项目信息
 */
router.post('/list', ( req, res, next ) => {
  const params = Object.assign({}, req.body);
  //console.error(req.body);
  projectService
    .queryAll(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})

/**
 * 更新项目
 */
router.post('/update', ( req, res, next ) => {
  const params = Object.assign({
    _id: req.session.user.id,
    updateTime: Date.now()
  }, req.body)
  projectService
    .updateOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 增加项目
 */
router.post('/add', ( req, res, next ) => {
  const params = Object.assign({
  }, req.body);
  console.log('*******', params);
  projectService
    .createOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 删除项目
 */
router.post('/delete', ( req, res, next ) => {
  const params = Object.assign({
  }, req.body)
  projectService
    .deleteOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
module.exports = router
