import React from 'react';
import PropTypes from 'prop-types';
import {Router, useRouterHistory} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

/**
 * Create enhanced history object for router
 * 使用 Immutable 后，需要重写该方法，替换 syncHistoryWithStore 中的默认 selectLocationState
 * 详情看源代码
 * @returns {function(*)}
 */
function createSelectLocationState() {
  let prevRoutingState, prevRoutingStateJS;
  return (state) => {
    const routingState = state.get('routing'); // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }
    return prevRoutingStateJS;
  };
}

const Root = ({routes, basename}) => {
  // 路由转换配置
  // Read more https://github.com/rackt/react-router/blob/latest/docs/Glossary.md#routeconfig
  const browserHistory = useRouterHistory(createBrowserHistory)({
    basename: basename ? basename : '/'
  });

  return (<Router history={browserHistory}>
    {routes}
  </Router>)
};

Root.propTypes = {
  routes: PropTypes.oneOfType([PropTypes.array, PropTypes.node, PropTypes.func]),
  basename: PropTypes.string
};

export default Root;

// 方便性能调试
if (process.env.NODE_ENV === 'development') {
  const Perf = require('react-addons-perf');
  /**
   * Perf.start()
   * Perf.stop()
   * Perf.printInclusive()
   */
  window.Perf = Perf;
}

// 异常监控管理平台
window.addEventListener('error', (e) => {
  // 向平台发送错误

});
