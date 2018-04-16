const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {ObjectId, Number, String} = Schema.Types;
const dataApi = require('./common');


const ProjectSchema = new Schema({
  projectName: {
    type: String,
    required: [true, '项目名称不能为空'],
    index: { unique: true },
    unique: true
  },
  projectDesc: {
    type: String,
    default: ''
  },
  projectType: {
    type: Boolean,
    default: true
  },
  createTime: {
    type: String,
    default: Date.now
  },
  updateTime: {
    type: String,
    default: Date.now
  },
  projectDepartment: {
    type: String
  }
}, {
  versionKey: false
});

ProjectSchema.virtual('key').get(function () {
  return this._id
});
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('autoIndex', false)
ProjectSchema.index({projectName: 1, projectType: 1, ProjectDepartment: 1})
dataApi(ProjectSchema, 'project');


const Project = mongoose.model('project', ProjectSchema);
module.exports = Project;
