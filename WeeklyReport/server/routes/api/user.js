const express = require('express');
const router = express.Router();
const UserService = require('../../service/user');
const {success, error} = require('../apiCommon');

/**
 * 获取用户全量列表
 */
router.post('/ulist', (req, res, next) => {
  let {userName} = req.body; // Get users by name
  const {page} = req.body
  // Support fuzzy query by name
  userName = { $regex: userName, $options: 'i' };
  // getUserListAll 
  UserService.getList({userName, page}).then( (doc) => {
    return res.json({code: 1, msg: 'success', data: doc});
  }).catch( (err) => {
    return res.json({code: -1, msg: err, data: null})
  });
});

/**
 * 查询用户信息
 */
router.post('/detail', ( req, res, next ) => {
  const {email} = req.body;
  const params = {
    email
  }
  UserService
    .queryOne(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
});

/**
 * 分页查询用户信息
 */
router.post('/list', ( req, res, next ) => {
  const {pageSize, pageNum} = req.body

  const params = Object.assign({
  }, req.body);
  params.pageSize = isNaN(Number(pageSize)) ? 10 : Number(pageSize);
  params.pageNum = isNaN(Number(pageNum)) ? 1 : Number(pageNum);
  UserService
    .pageQuery(params)
    .then((result) => {

      success(result, res)
    })
    .catch(err => error(err, res))
})

/**
 * 删除用户
 */
router.post('/delete', (req, res, next) => {
  UserService.remove(req.body._id).then((doc) => {
    return res.json({code: 1, msg: 'success', data: doc});
  }).catch((err) => {
    return res.json({code: -1, msg: err, data: null})
  })
});

/**
 * 注册用户
 */
router.post('/add', (req, res, next) => { // 添加之前需要首先查询
  UserService
    .queryOne({email: req.body.email})
    .then((result) => {
      if (result) {
        return res.json({code: -1, msg: '该邮箱已注册，请直接登录~', data: null})
      } else {
        UserService.add(req.body).then((doc) => {
          return res.json({code: 1, msg: '注册成功🙋', data: doc});
        }).catch((err) => {
          return res.json({code: -1, msg: err, data: null})
        })
      }
    })
    .catch(err => error(err, res))
});

/**
 * 更新用户信息
 */
router.post('/froze', (req, res, next) => {
  const options = {
    _id: req.body._id,
    user_status: req.body.user_status === 1 ? 1 : 0
  };
  UserService.updateInfo(options).then((doc) => {
    return res.json({code: 1, msg: 'success', data: doc});
  }).catch((err) => {
    return res.json({code: -1, msg: err, data: null})
  })
});

/**
 * 更新用户权限信息
 */
router.post('/role', (req, res, next) => {
  const options = {
    _id: req.body._id,
    user_role: req.body.user_role === 999 ? 999 : 1
  };
  UserService.updateInfo(options).then((doc) => {
    return res.json({code: 1, msg: 'success', data: doc});
  }).catch((err) => {
    return res.json({code: -1, msg: err, data: null})
  })
});

/**
 * 更新用户信息
 */
router.post('/update', ( req, res, next ) => {
  const params = Object.assign({
    updateTime: Date.now()
  }, req.body)
  UserService
    .updateInfo(params)
    .then((result) => {
      success(result, res)
    })
    .catch(err => error(err, res))
})

/**
 * 登录
 */
router.post('/login', ( req, res, next ) => {
  UserService
    .queryOne({email: req.body.email})
    .then((result) => {
      if (result.password === req.body.password) {
        success(result, res)
      } else {
        return res.json({code: -1, msg: '密码错误', data: null})
      }
    })
    .catch(err => error(err, res))
})

module.exports = router;
