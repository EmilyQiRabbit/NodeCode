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
    return `${buildLink(fileMapping['vendor.css'])}${buildLink(fileMapping[`${key}.css`])}`;
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
  return fileMapping ? fileMapping.title : '大黄蜂-周报系统';
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
 * 后台入口
 */
router.get('*', (req, res, next) => {
  const {userinfo} = req.session;
  //console.log('userInfo --> ', req.userinfo);
  const ret = getRenderData('userPages', userinfo);
  // ret.layout = false;
  // console.log(ret);
  res.render('userPages', ret);
});

module.exports = router;
