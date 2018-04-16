const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId, Number} = Schema.Types
const DraftSchema = new Schema({ // 草稿
  // 创建草稿方的用户 id
  userId: {
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
  // 内容
  details: [{type: ObjectId, ref: 'detail'}],
  // 发送给 抄送给
  sendTo: [{
    type: ObjectId,
    ref: 'user'
  }],
  copyTo: [{
    type: ObjectId,
    ref: 'user'
  }],
  // 创建时间
  createTime: {
    type: Number,
    default: Date.now()
  },
  // 创建时间
  updateTime: {
    type: Number,
    default: Date.now()
  }
}, {
  versionKey: false
})
DraftSchema.index({updateTIme: -1})
DraftSchema.virtual('key', function () {
  return this._id
})
DraftSchema.set('toJSON', {virtuals: true})
DraftSchema.set('autoIndex', false)
DraftSchema.index({userId: 1, year: 1, week: 1, status: 1})

const Draft = mongoose.model('draft', DraftSchema)
module.exports = Draft
