const global = require('../global')
const {SSO_URL} = process.env
const passportService = require('../service/passport')
const UserModel = require('../model/User')
const loginMsg = {
  code: 601,
  msg: '请登录',
  data: null
}
const userAuth = (type) => {
  return (req, res, next) => {
    const returnUrl = `${encodeURIComponent(`${req.protocol}://${req.headers.host}${req.originalUrl}`)}` || '';
    const loginUrl = `${SSO_URL}/login?returnUrl=${returnUrl}`
    if(req.session.user) {
      next()
    } else {
      const bkjkPin = req.cookies[global.secret]
      if (!bkjkPin) {
        if (type === 'page') {
          res.redirect(loginUrl)
        } else {
          res.json(loginMsg)
        }
      } else {
        passportService.checkLogin(req, res, {
          token: bkjkPin
        }).then((data) => {
          if(data.code === 200) {
            const user = data.data
            //先查数据库有没有该用户
            UserModel.findOne({userCode: user.usercode})
            .exec(function ( err, doc ) {
              if(err) return next(err)
              //已存用户
              if (doc) {
                req.session.user = doc
                console.log('已经登录啦', doc.key)
                next()
              } else {
                //todo
                //用户不存在
                //UserModel 往数据库存数据
                UserModel.create({
                  userCode: user.usercode,
                  userName: user.name,
                  account: user.account,
                  mobile: user.mobile,
                  email: user.email,
                  avatar: user.avatar
                }, function ( err, doc ) {
                  if (err) return next(err)
                  req.session.user = doc
                  if (type === 'page') {
                    res.redirect('用户信息录入页面')
                  } else {
                    next()
                  }
                })
              }
            })
          }
        }).catch((err) => {
          if (type === 'page') {
            res.redirect(loginUrl)
          } else {
            res.json({
              code: 0,
              msg: JSON.stringify(err),
              data: null
            })
          }
        })
      }
    }
  }
}

const adminAuth = (type) => {
  return (req, res, next) => {
    const {username, password} = req.session.user
    if (username === global.adminName && password === global.adminPassword) {
      next()
    } else {
      if (type === 'page') {
        res.redirect('管理后台登录页面')
      } else {
        res.json(loginMsg)
      }
    }
  }
}
module.exports = {
  userAuth,
  adminAuth
}
