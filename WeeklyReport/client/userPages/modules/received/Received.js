import React, { Component } from 'react'
import { Link } from 'react-router'
import action from '../dataFile/action'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Select, List, message } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
const { Header, Footer, Sider, Content } = Layout;
import PropTypes from 'prop-types'
const moment = require('moment')

class Received extends Component {

  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired
    } ).isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor( options ) {
    super( options );
    const { location, router } = this.props;
    const { query } = location;
    const { year, week, projectName } = query;

    this.state = {
      receivedList: [],
      projectList: [],
      formValues: {
        year: year || moment().year(),
        week: week || moment().weeks(),
        projectName: projectName || '',
      },
    }
    
    if (window.INIT_DATA.userinfo) {
      // Query info
      // 0：我收到的 1：抄送我的
      action.postInfo({
        to: window.INIT_DATA.userinfo.email,
        year: this.state.formValues.year,
        week: this.state.formValues.week,
        projectName: this.state.formValues.projectName,
        URL: 'report/received'
      }).then((doc) => {
        this.setState({
          receivedList: doc.data.list
        })
      }).catch((err) => {
        console.log(err)
        message.error( <action.Info>{err.toString()}</action.Info> )
      });
      action.postInfo({
        URL: 'project/list',
        projectName: ''
      }).then((doc) => {
        this.setState({
          projectList: doc.data.list
        })
      });
    }
  }

  generateQueryStr = ( object ) => {
    const arr = [];
    for ( const i in object ) {
      if ( i && object[i]) {
        arr.push( `${i}=${window.encodeURIComponent( object[i] || '' )}`)
      }
    }
    return arr.join( '&' )
  };

  handleSearchSubmit = (evt) => {
    evt.preventDefault();
    const { validateFields } = this.props.form;
    const { router } = this.props;
    validateFields( ( err, values) => {
      if ( !err ) {
        values.URL = 'report/received';
        values.to = window.INIT_DATA.userinfo.email;
        action.postInfo( values ).then((doc) => {
          this.setState({
            receivedList: doc.data.list
          })
        });
        this.dataSourceReceive = []
        this.dataSourceCopy = []
      }
    } )
  };

  checkReport = (report) => {
    return (e) => {
      const {router} = this.props;
      action.postInfo({
        URL: 'report/setRead',
        reportId: report.id,
        messageId: report.messageId
      })
      router.push({
        pathname: '/checkReport',
        query: {
          reportId: report.id
        }
      })
    }
  }

  render() { // 不要分页，默认只显示本周周报
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    const list = this.state.receivedList;

    const dataSourceReceive = [];
    const dataSourceCopy = [];

    if (list) {
      list.forEach( (item, index) => {
        item.key = item.reportId
        //item.content = `${item.content.slice(0, 10)}...`;
        item.name = item.userId ? item.userId.userName : ''; // 发件人
        item.time = `${item.year}年 第${item.week}周`;
  
        item.project = ''
        const set = new Set()
        item.details.forEach( (detail) => {
          if (detail) {
            set.add(detail.projectName)
          }
        });
        set.forEach( (detail) => {
          item.project += `${detail} `
        });
        
        // Read or unread
        item.messages.forEach((msg) => {
          if (msg.to && msg.to.email === window.INIT_DATA.userinfo.email) {
            item.messageId = msg.id;
            item.readStatus = msg.status === 0 ? '未读' : msg.status === 1 ? '已读' : '';
          }
        })
        
        // Main or copy
        item.messages.forEach((msg) => {
          if (msg.to && msg.to.email === window.INIT_DATA.userinfo.email) {
            if (msg.type === 0) {
              dataSourceReceive.push(item)
            } else if (msg.type === 1) {
              dataSourceCopy.push(item)
            }
          }
        })
      });
    }

    // 项目热搜索数据源
    const pjList = this.state.projectList;
    const projectDataSource = pjList ? Array.from(pjList).map((item) => {
      return <Option key={item.projectName} >{item.projectName}</Option>;
    }) : [];

    return (
      <div style={{marginBottom: 65}}>
        <Form
          onSubmit={this.handleSearchSubmit}
        >
          <Row>
            <Col span={20} offset={2} style={{paddingTop: 20, background: '#F5F5F5', marginTop: 30}}>
              <Col span={6} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label='年份：'
                >
                  {getFieldDecorator('year', {
                    initialValue: this.state.formValues.year
                  })(
                    <Input placeholder="请输入年份"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='星期：'
                >
                  {getFieldDecorator('week', {
                    initialValue: this.state.formValues.week
                  })(
                    <Input placeholder="请输入年内星期数"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='项目：'
                >
                  {getFieldDecorator('projectName', {

                  })(
                    <Select 
                      allowClear
                      //showSearch // use that prop, then the select can be writen
                      className="withoutRadius"  
                      //onSearch={this.handleProjectChange}
                      placeholder="请选择项目">
                      {projectDataSource}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  <Button type="primary" htmlType="submit" size="default" style={{height: 30, lineHeight: '30px'}}>搜索</Button>
                </FormItem>
              </Col>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={10} offset={2}>
            <List
              style={{marginTop: 20, marginRight: 5}}
              header='收件人是我'
              itemLayout="horizontal"
              dataSource={dataSourceReceive}
              bordered
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<div><a onClick={this.checkReport(item)}>发件人：{item.name}</a><span style={{color: item.readStatus === '未读' ? 'red' : 'green'}}>
                      &nbsp;&nbsp;[{item.readStatus}]</span> </div>}
                    description={<div><div>发送时间：{item.time}</div>相关项目：{item.project}</div>}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col span={10}>
            <List
              style={{marginTop: 20, marginLeft: 5}}
              header='抄送给我'
              itemLayout="horizontal"
              dataSource={dataSourceCopy}
              bordered
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<div><a onClick={this.checkReport(item)}>发件人：{item.name}</a><span style={{color: item.readStatus === '未读' ? 'red' : 'green'}}>
                      &nbsp;&nbsp;[{item.readStatus}]</span> </div>}
                    description={<div><div>发送时间：{item.time}</div>相关项目：{item.project}</div>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()( Received );
