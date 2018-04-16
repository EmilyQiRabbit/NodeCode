import React from 'react'
import { render } from 'react-dom'
import {Route, IndexRoute} from 'react-router';
import {combineReducers} from 'redux-immutable';

const URL_CONTEXT = require('../../Config').reportFrontContext;
/**
 * 这里用来配置路由规则
 */
import App from './app/';
import SignIn from './modules/userCenter/SignIn'
import Login from './modules/userCenter/login'
import Received from './modules/received/Received'
import Send from './modules/send/Send'
import UserCenter from './modules/userCenter/UserCenter'
import Hack from './modules/hack/Hack'
import NewReport from './modules/newReport/NewReport'
import SendSuccess from './modules/newReport/SendSuccess'
import CheckReport from './modules/checkReport/CheckReport'

const routes = (
  <Route path="/" breadcrumbName="主页" icon="home" component={App}>
    <IndexRoute breadcrumbName="控制面板" icon="laptop" component={Received} />
    <Route path="/login" breadcrumbName="登录" icon="bars" component={Login} ></Route>
    <Route path="/signIn" breadcrumbName="注册" icon="bars" component={SignIn} ></Route>
    <Route path="/received" breadcrumbName="我收到的" icon="bars" component={Received} ></Route>
    <Route path="/send" breadcrumbName="我发起的" icon="bars" component={Send} ></Route>
    <Route path="/userCenter" breadcrumbName="用户中心" icon="bars" component={UserCenter} ></Route>
    <Route path="/hackPage" breadcrumbName="删数据" icon="bars" component={Hack} ></Route>
    <Route path="/sendSuccess" breadcrumbName="发送成功" icon="bars" component={SendSuccess} ></Route>
    <Route path="/newReport" breadcrumbName="新建周报" icon="bars" component={NewReport} ></Route>
    <Route path="/checkReport" breadcrumbName="邮件详情" icon="bars" component={CheckReport} ></Route>
  </Route>
);

/**
 * render document
 */
import Root from '../Root'
render(
  <Root routes={routes} basename={`/${URL_CONTEXT}`} />,
  document.getElementById('main')
);
