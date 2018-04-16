/**
 * department.js
 * 
 */
const departmentService = require('../../service/department')
const express = require('express')
const router = express.Router()
const {success, error} = require('../apiCommon')
const {id} = require('../../global')

/**
 * 查询部门信息
 */
router.post('/pageList',  ( req, res, next ) => {
  let {pageSize, pageNum} = req.body;
  pageSize = isNaN(Number(pageSize)) ? 10 : Number(pageSize);
  pageNum = isNaN(Number(pageNum)) ? 1 : Number(pageNum);
  // req.session.user = {
  //   id
  // }
  const params = Object.assign({
  }, req.body);
  params.pageSize = pageSize;
  params.pageNum = pageNum;

  departmentService
    .pageQuery(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 查询部门信息
 */
router.post('/list', ( req, res, next ) => {
  const params = Object.assign({
  }, req.body);
  
  departmentService
    .query(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 更新部门信息
 */
router.post('/update', ( req, res, next ) => {
  req.session.user = {
    id
  }
  const params = Object.assign({
    _id: req.session.user.id,
    updateTime: Date.now()
  }, req.body)
  departmentService
    .updateOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 增加部门信息
 */
router.post('/add', ( req, res, next ) => {
  req.session.user = {
    id
  }
  const params = Object.assign({
  }, req.body)
  departmentService
    .createOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
/**
 * 删除部门信息
 */
router.post('/delete', ( req, res, next ) => {
  req.session.user = {
    id
  }
  const params = Object.assign({
  }, req.body)
  departmentService
    .deleteOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})
module.exports = router
