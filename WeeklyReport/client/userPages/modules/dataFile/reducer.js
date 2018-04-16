/**
 * Created by ink on 2017/8/1.
 */
import { combineReducers } from 'redux-immutable'
import { Map, List } from 'immutable'
import * as Actions from './action'
const { REPORT_ACTION_TYPES } = Actions;
const receivedList = ( state = Map( { // 查询收到的周报
  total: 0,
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.RECEIVED_LIST:
      return Map( action.data );
    default:
      return state
  }
};

const sendedList = ( state = Map( { // 查询发送的周报
  total: 0,
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.SENDED_LIST:
      return Map( action.data );
    default:
      return state
  }
};

const savedReport = ( state = Map( { // 查询发送的周报
  total: 0,
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.SAVED_REPORT:
      return Map( action.data );
    default:
      return state
  }
};

const savedDraft = ( state = Map( { // 查询发送的周报
  total: 0,
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.SAVED_DRAFT:
      return Map( action.data );
    default:
      return state
  }
};

const projectList = ( state = Map( { // 查询项目列表
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.PROJECT_LIST:
      return Map( action.data );
    default:
      return state
  }
};

const departmentList = ( state = Map( { // 查询部门列表
  list: List( [] )
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.DEPARTMENT_LIST:
      console.error(action.data);
      return Map( action.data );
    default:
      return state
  }
};

const reportDetail = ( state = Map( { // 周报详情
  
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.REPORT_DETAIL:
      return Map( action );
    default:
      return state
  }
};

const getUnreadNumber = ( state = Map( { // 未读周报数量
  count: 0
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.UNREAD_NUM:
      return Map( action.data );
    default:
      return state
  }
};

const setReportRead = ( state = Map( { // 设置周报状态为已读
  reportId: 0,
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.SET_REPORT_READ:
      return Map( action.data );
    default:
      return state
  }
};

const userInfo = ( state = Map( { // 查询个人信息
  
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.USER_INFO:
      return Map( action.data );
    default:
      return state
  }
};

const userListInfo = ( state = Map( { // query user List all
  list: List([]),
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.USERLIST_INFO:
      return Map( action.data );
    default:
      return state
  }
};

// 更新个人信息.....(同上)

const createReport = ( state = Map( { // 创建周报 不一定需要
  reportId: 0,
} ), action ) => {
  switch ( action.type ) {
    case REPORT_ACTION_TYPES.CREATE_REPORT:
      return Map( action.data );
    default:
      return state
  }
};

export default combineReducers( {
  receivedList,
  sendedList,
  userListInfo,
  departmentList,
  reportDetail,
  getUnreadNumber,
  setReportRead,
  userInfo,
  createReport,
  projectList,
  savedReport,
  savedDraft
} )
