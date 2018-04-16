/**
 * 自动加载路由配置
 */
const fs = require('fs');
const path = require('path');
const logger = require('./helper/mylogger').Logger;

const isDev = process.env.NODE_ENV === 'development';
global.fileMapping = isDev ? null : require('../public/static/mapping.json');

const AuthService = require('./service/auth');
const UserService = require('./service/user');

/**
 * 接口权限校验
 * @param req
 * @param res
 * @param next
 */
function checkAuthLogin(req, res, next) {
  const ssoUrl = process.env.SSO_URL;
  const returnUrl = `${encodeURIComponent(`${req.protocol}://${req.headers.host}${req.originalUrl}`)}` || '';
  // if (req.session.userinfo && req.cookies[global.config.secret]) {
  //   next();
  // } else {

    /**
     * Auth授权进行登录验证,
     * 没有登录->进行登录,
     * 登录成功->获取用户信息; 登录不成功, 跳到登录
     * 获取用户信息->获取到,写入session; 获取不到,写入数据库,并写入session
     */
    AuthService.checkLogin(req).then(doc => {
      if (doc.code === 200) {
        const uinfo = doc.data;
        let user_role = 1;
        return UserService.getInfo({
          email: uinfo.email
        }).then(res => {

          if (res && res.msg === 'reg') {
            if (global.config.defaultAdmin.indexOf(uinfo.email) > -1) {
              user_role = 999
            }
            return UserService.createOne({
              email: uinfo.email,
              userName: uinfo.name,
              user_role,
              userCode: uinfo.usercode,
              account: uinfo.account,
              mobile: uinfo.mobile,
              avatar: uinfo.avatar
            }).then(userInfo => {
              req.session.userinfo = userInfo;
              next();
            }).catch(err => {
              return Promise.reject(new Error({ msg: err }));
            });
          } else {
            req.session.userinfo = res;
            next();
          }
        });

      } else {
        return Promise.reject(new Error({ msg: doc.msg}));
      }
    }).catch(err => {
      console.log(err);
      res.format({
        'text/plain': () => {
          return res.redirect(`${ssoUrl}login?returnUrl=${returnUrl}`);
        },
        'text/html': () => {
          return res.redirect(`${ssoUrl}login?returnUrl=${returnUrl}`);
        },
        'application/json': () => {
          res.json({code: '-1', msg: '请重新登录', data: null});
        },
        // 'default': () => {
        //   return res.redirect(ssoUrl);
        // }
      });
    });

  //}
}

/**
 * 检查接口权限
 * @param req
 * @param res
 * @param next
 */
function checkUserRole(req, res, next) {
  if (req.session.userinfo && req.session.userinfo.user_role && req.session.userinfo.user_role === 999) {
    next()
  } else {
    res.json({code: '-1', msg: '无权限', data: null})
  }
}

/**
 * 添加api路由
 * @param app
 * @param options
 */
function addRoute(app, options) {
  const apiDir = '/routes/api/';
  const apiRootPath = path.join(__dirname, apiDir);
  /**
   * 构建路由拦截相对路径
   * @param routePath
   * @returns {string}
   */
  const buildRouteContext = function (routePath) {
    const rootLength = apiRootPath.length;
    return routePath.length === rootLength
      ? apiDir
      : `${apiDir}${routePath.substring(rootLength)}/`;
  };

  const isFile = function (name) {
    return (/\.js/).test(name);
  };
  /**
   * 递归添加api路由
   * @param routePath
   */
  const addApiRoute = function (routePath) {
    fs.readdirSync(routePath).forEach((name) => {
      if (!isFile(name)) {
        addApiRoute(path.join(routePath, name)); //递归添加子路由
      } else {
        const route = buildRouteContext(routePath);
        const routeName = (route + name.replace(/.js/, '')).replace(/\\/g, '/');
        const obj = require(`.${routeName}`);
        const key = name.replace(/.js/, '');
        const authList = {
          user: true,
          project: true,
          department: true,
          report: true,
          draft: true
        };
        if (key.indexOf('report') > -1 || key.indexOf('draft') > -1) {
          app.use(routeName.replace(/\/routes/, ''), obj);
          //console.log('auth --> ', key, routeName);
        } else {
          app.use(routeName.replace(/\/routes/, ''), obj); // TODO 999 权限问题
          //console.log('auth with 999 --> ', key, routeName);
        }
        logger.info(`add api route automatic:${routeName.replace(/\/routes/, '')}`);
      }
    });
  };

  //api路由配置
  addApiRoute(apiRootPath);
}

const Admin = require('./routes/page/admin'); //后台路由
const Home = require('./routes/page/index'); //页面路由

module.exports = function(app) {
  addRoute(app); //添加api路由
  app.use('/admin', Admin); //后台路由
  app.use('/', Home); //前台路由
}
