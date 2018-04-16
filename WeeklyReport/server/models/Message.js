const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Number, String} = Schema.Types
const MessageSchema = new Schema({
  // 发送者id
  from: {
    type: ObjectId,
    required: true,
    ref: 'user'
  },
  // 消息状态 0：未读 1：已读
  status: {
    type: Number,
    default: 0
  },
  // 接收者id
  to: {
    type: ObjectId,
    required: true,
    ref: 'user'
  },
  // 周数
  week: {
    type: Number,
    required: true
  },
  // 年份
  year: {
    type: Number,
    required: true
  },
  // 0:主送，1:抄送
  type: {
    type: Number,
    required: true
  },
  // 周报id或者日报id
  reportId: {
    type: ObjectId,
    required: true,
    ref: 'report'
  },
  // 发送时间
  createTime: {
    type: Number,
    default: Date.now
  },
  // 更新时间
  updateTime: {
    type: Number,
    default: Date.now
  }
}, {
  versionKey: false
});

MessageSchema.virtual('key').get(function () {
  return this._id;
});
MessageSchema.set('toJSON', {virtuals: true});
MessageSchema.set('autoIndex', false)
MessageSchema.index({from: 1, to: 1, week: 1, year:1, reportId: 1, type: 1})


module.exports = mongoose.model('message', MessageSchema);
