import React from 'react'
import { render } from 'react-dom'
import {Route, IndexRoute} from 'react-router';


/**
 * 这里用来配置路由规则
 */
import App from './app/index';
import Dashboard from './dashboard/index';

const routeConfig = [
  {
    path: '/',
    component: App,
    breadcrumbName: '主页',
    icon: 'home',
    indexRoute: {
      component: Dashboard,
      breadcrumbName: '控制面板',
      icon: 'laptop'
    },
    childRoutes: [
      /**
       * 用户管理
       */
      {
        path: 'user',
        breadcrumbName: '用户管理',
        icon: 'folder',
        getComponent: (nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./user/index').default);
          })
        }
      },
      /**
       * 部门管理
       */
      {
        path: 'department',
        breadcrumbName: '部门管理',
        icon: 'folder',
        getComponent: (nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./department/index').default);
          })
        }
      },
      /**
       * 项目管理
       */
      {
        path: 'project',
        breadcrumbName: '项目管理',
        icon: 'folder',
        getComponent: (nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./project/index').default);
          })
        }
      },
    ]
  }
]

/**
 * render document
 */
import Root from '../Root'
render(
  <Root routes={routeConfig} basename='/admin' />,
  document.getElementById('layout')
);
