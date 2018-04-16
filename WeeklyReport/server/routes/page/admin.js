/**
 * 前台首页路由设置
 */

'use strict'

const express = require('express');
const router = express.Router();

/**
 * 获取css结构
 */
function getCss (key) {
  const fileMapping = global.fileMapping;
  const buildLink = function (href) {
    return `<link href="${href}" rel="stylesheet">\n`;
  };
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  if (fileMapping[`${key}.css`]) {
    return `${buildLink(fileMapping[`${key}.css`])}`;
  } else {
    return '';
  }
}

/**
 * 获取js结构
 */
function getJs (key) {
  const fileMapping = global.fileMapping;
  const buildScript = function (src) {
    return `<script src="${src}"></script>\n`;
  };
  if (process.env.NODE_ENV === 'development') {
    return `${buildScript('/public/dll/vendor.dll.js')}${buildScript(`/public/static/${key}.bundle.js`)}`;
  }
  //如果不是公共部分，只获取业务代码，不获取vendor脚本
  if (fileMapping[`${key}.js`]) {
    return `${buildScript(fileMapping['manifest.js'])}${buildScript(fileMapping['vendor.js'])}${buildScript(fileMapping[`${key}.js`])}`;
  } else {
    return '';
  }
}

/**
 * 获取title
 */
function getTitle () {
  const fileMapping = global.fileMapping;
  return fileMapping ? fileMapping.title : '周报系统-后台管理';
}

/**
 * 获取Render的数据结构
 */
function getRenderData(moduleName, userinfo = {}) {
  const links = getCss(moduleName);
  const scripts = getJs(moduleName);
  const title = getTitle(moduleName);
  const data = {
    domain: 'http://mk.bkjk.com',
    userinfo
  }
  return {
    title,
    links,
    scripts,
    data: JSON.stringify(data)
  }
}

/**
 * 用户退出
 */
router.get('/logout', (req, res, next) => {
  const {SSO_URL} = process.env;
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect(SSO_URL);
    }
  })
});

/**
 * 后台入口
 */
router.get('*', (req, res, next) => {
  const ret = getRenderData('adminPages', req.session.userinfo);
  // ret.layout = false;
  // console.log(ret);
  res.render('adminPages', ret);
});

module.exports = router;
