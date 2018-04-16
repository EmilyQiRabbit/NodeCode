import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router'

import { Layout, Menu, Icon } from 'antd';
const { Header, Footer, Content } = Layout;
import './index.less'

export class App extends Component {

  static propTypes = {
    children: PropTypes.node,
    router: PropTypes.object,
    routes: PropTypes.array
  };

  constructor(props) {
    super(props);
    window.router = this.props.router;
    window.routes = this.props.routes;
    const menu = {
      newReport: {
        name: '我要写周报',
        link: 'newReport',
        icon: 'file-add'
      },
      send: {
        name: '发件箱',
        link: 'send',
        icon: 'upload'
      },
      received: {
        name: '收件箱',
        link: 'received',
        icon: 'download'
      },
      userCenter: {
        name: '有关于我',
        link: 'userCenter',
        icon: 'user'
      }
    }

    const location = window.location.pathname.split('/') ? window.location.pathname.split('/').pop() : 'newReport';
    //console.log('location', location);

    this.state = {
      menu,
      menuDefaultSelectedKeys: [location],
      ifLogin: 0
    }

    window.INIT_DATA.userinfo = window.INIT_DATA.userinfo && window.INIT_DATA.userinfo.email ? window.INIT_DATA.userinfo : JSON.parse(window.localStorage.getItem('userinfo'));
    if (!window.INIT_DATA.userinfo) {
      this.props.router.push('/login')
    }
    
  }

  login = () => {
    if (window.INIT_DATA.userinfo && window.INIT_DATA.userinfo.nickName) {
      window.localStorage.removeItem('userinfo');
      window.INIT_DATA.userinfo = null
    }
    this.props.router.push('/login')
  }

  signIn = () => {
    this.props.router.push('/signIn')
  }

  render() {
    let ifLogin = false;
    if (window.INIT_DATA.userinfo) {
      ifLogin = window.INIT_DATA.userinfo.nickName || window.INIT_DATA.userinfo.userName;
    }
    return (
      <div className='userPageLayout'>
        <div className='menu'>
          <Menu
            defaultSelectedKeys={this.state.menuDefaultSelectedKeys}
          >
            <div className="logo" ><Icon type="rocket" /> COFFEE.INC</div>
            {
              ifLogin ? (
                <Menu.Item>
                  <Link to={{pathname: 'userCenter'}}> Hi，{ifLogin} </Link>
                </Menu.Item>) : ''
            }
            <Menu.Item key="login">
              <a onClick={this.login}><Icon type="poweroff" />{ifLogin ? '登出' : '登录'}</a>
            </Menu.Item>
            <Menu.Item key="signIn">
              <a onClick={this.signIn}><Icon type="plus-circle-o" />注册</a>
            </Menu.Item>
            {
              ifLogin ? (
                  ((innerThis) => {
                    const menuItems = [];
                    for (const key in innerThis.state.menu) {
                      if (key && innerThis.state.menu[key]) {
                        menuItems.push(<Menu.Item key={key}><Link to={{pathname: innerThis.state.menu[key].link, query: {}}}>
                          <Icon type={innerThis.state.menu[key].icon} />{innerThis.state.menu[key].name}</Link></Menu.Item>)
                      }
                    }
                    menuItems.push(<Menu.Item key="admin">
                      <a href='/admin'><Icon type="setting" />后台信息管理</a>
                    </Menu.Item>)
                    return menuItems;
                  })(this)
                ) : ''
            }
            
          </Menu>
        </div>
        <Content className='mainContent'><div>{this.props.children}</div></Content>
        <Footer><div><span style={{color: '#f0f2f5'}}>WISH YOU A NICE WEEKEND {'<<<'}</span> 
          ©2018 Powered By EmilyQiRabbit <span style={{color: '#f0f2f5'}}>{'>>>'} ENJOY A CUP OF COFFEE</span></div></Footer>
      </div>
    );
  }
}

export default App;//connect(mapStateToProps)(App);
