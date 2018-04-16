'use strict';
const mongoose = require('mongoose');
const dataApi=require('./common');

/**
* 1、定义Schema 
*/
var TermSchema = new mongoose.Schema({
  term_name: {
    type : String,
    required: [true, '分类名称不能为空'],
    validate: [
      {
        validator: function (val) {
          return !/[(\ )(\~)(\!)(\@)(\#) (\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=) (\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/) (\<)(\>)(\?)(\)]+/.test(val);
        },
        msg: '请输入正确的分类名称（支持中文数字英文，"_" "-"，请勿包含特殊字符）'
      }
    ]
  },
  term_slug: {
    type : String,
    validate: [
      {
        validator: function (val) {
          return /^[a-z-_]+$/.test(val);
        },
        msg: '缩略名只能为英文'
      }
    ],
    required: [true, '缩略名不能为空']
  },
  term_type: {
    type : String,
    default: 'post',
    enum: ['post', 'page', 'activity'],
    required: [true, '类型不能为空']
  },
  term_desc: {
    type : String
  }
});

dataApi(TermSchema,'term');
/**
* 2、将 Schema 生成为 Model
*/
module.exports = mongoose.model('term', TermSchema);