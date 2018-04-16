import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import './styles.less';


import { Layout, Menu, Breadcrumb, Icon, Avatar } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ?
    <span><Icon type={route.icon} style={{marginRight: '3px'}} />{route.breadcrumbName}</span> :
    <Link to={paths.join('/')}><Icon type={route.icon} style={{marginRight: '3px'}} />{route.breadcrumbName}</Link>;
}

export class App extends Component {

  static propTypes = {
    children: PropTypes.node,
    routes: PropTypes.array,
    location: PropTypes.object,
    router: PropTypes.object
  };

  state = {
  }

  goHome = () => {
    this.props.router.push({ pathname: '/' });
  }

  /**
   * menu click handle
   * @param item
   * @param key
   * @param keyPath
   */
  menuHandleClick = (item) => {
    const pathname = this.props.location.pathname;
    if (item && item.key && item.key.indexOf('report') < 0) {
      if (pathname !== item.key) {
        this.props.router.push({
          pathname: item.key
        })
      }
    }
  }

  render() {
    const {routes, location} = this.props;
    let path = location.pathname;
    if (path.split('/')[2] === 'edit') {
      path = '/post';
    }
    const userinfo = window.INIT_DATA || JSON.parse(window.localStorage.getItem('userinfo'));

    return (
      <Layout>
        <Sider width={180}>
          <div className="logo" onClick={this.goHome} />
          <Menu theme="dark"
                selectedKeys={[path]}
                mode="inline"
                defaultOpenKeys={['project', 'department', 'system', 'report']}
                onClick={this.menuHandleClick} >

            <SubMenu key="system" title={<span><Icon type="setting" /><span>用户管理</span></span>}>
              <Menu.Item key="/user">用户管理</Menu.Item>
            </SubMenu>

            <SubMenu key="project" title={<span><Icon type="folder" /><span>项目管理</span></span>}>
              <Menu.Item key="/project">项目管理</Menu.Item>
            </SubMenu>

            <SubMenu key="department" title={<span><Icon type="folder" /><span>部门管理</span></span>}>
              <Menu.Item key="/department">部门管理</Menu.Item>
            </SubMenu>

            <SubMenu key="report" title={<span><Icon type="edit" /><span>周报管理</span></span>}>
              <Menu.Item key="report-new"><a href='../reportFront/newReport'>写周报</a></Menu.Item>
              <Menu.Item key="report-received"><a href='../reportFront/received'>收件箱</a></Menu.Item>
              <Menu.Item key="report-send"><a href='../reportFront/send'>发件箱</a></Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>
        <Layout style={{ overflow: 'auto'}}>
          <Header style={{ background: '#fff', padding: 0 }} >

            <Menu mode="horizontal" className="ant-avatar-wrap" >
              <SubMenu title={
                <span className="ant-avatar-wraper">
                  {userinfo.userName}
                </span>
              }>
                <Menu.Item key="logout">
                  <a onClick={this.jump}><Icon type="logout" />退出</a>
                </Menu.Item>
              </SubMenu>
            </Menu>

          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '20px 0' }} routes={routes} itemRender={itemRender} />
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ©2018 Powered by EmilyQiRabbit
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
