const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Number, String} = Schema.Types

const DetailSchema = new Schema({
  //写周报人的id
  userId: {
    type: ObjectId,
    required: true,
    ref: 'user'
  },
  //周报id或者日报id
  reportId: {
    type: ObjectId,
    required: true,
    ref: 'report'
  },
  //项目id
  projectId: {
    type: ObjectId,
    required: true,
    ref: 'project'
  },
  //项目名称
  projectName: {
    type: String,
    required: true,
    ref: 'project'
  },
  //年份
  year: {
    type: Number,
    required: true
  },
  //周数
  week: {
    type: Number,
    required: true
  },
  //内容
  content: {
    type: String,
    default: ''
  },
  //本周总结:0 下周计划:1
  type: {
    type: Number,
    default: 0
  },
  //创建时间
  createTime: {
    type: Number,
    default: Date.now
  },
  //更新时间
  updateTime: {
    type: Number,
    default: Date.now
  }
}, {
  versionKey: false
});

DetailSchema.virtual('key').get(function () {
  return this._id;
});
DetailSchema.set('toJSON', { virtuals: true });
DetailSchema.set('autoIndex', false)
DetailSchema.index({userId: 1, reportId: 1, projectId: 1, projectName:1, year: 1, week: 1, type: 1})

module.exports = mongoose.model('detail', DetailSchema);
