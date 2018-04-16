import React, { Component } from 'react'
import { Link } from 'react-router'
import action from '../dataFile/action'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Select, List } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const { Header, Footer, Sider, Content } = Layout;
import PropTypes from 'prop-types'
const moment = require('moment')

class Send extends Component {

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
    const { location } = this.props;
    const { query } = location;
    const { year, week, projectName } = query;

    this.state = {
      sendList: [],
      projectList: [],
      formValues: {
        year: year || moment().year(),
        week: week || moment().weeks(),
        projectName: projectName || ''
      },
    }
    if (window.INIT_DATA.userinfo) {
      action.postInfo({
        from: window.INIT_DATA.userinfo.email,
        year: this.state.formValues.year,
        week: this.state.formValues.week,
        projectName: this.state.formValues.projectName,
        URL: 'report/sended'
      }).then((doc) => {
        this.setState({
          sendList: doc.data.list
        })
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
        const {
          formValues
        } = this.state;
        const queryObj = Object.assign( {
          URL: 'report/sended',
          from: window.INIT_DATA.userinfo.email,
        }, formValues, values );
        action.postInfo( queryObj ).then((doc) => {
          this.setState({
            sendList: doc.data.list
          })
        });
      }
    } )
  };

  render() { // 不要分页，全都默认显示本周周报
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    
    const list = this.state.sendList

    const dataSource = list.map( (item, index) => {
      item.tableNums = index + 1;
      item.key = index + 1;

      item.sendTo = '';
      item.copyTo = '';
      item.messages.forEach( (messageObj) => { // message.type 0:主送，1:抄送
        if (messageObj.type === 0) {
          item.sendTo += `${messageObj.to ? messageObj.to.userName : ''} `;
        } else {
          item.copyTo += `${messageObj.to ? messageObj.to.userName : ''} `;
        }
      });

      item.projects = ''
      const set = new Set()
      item.details.forEach( (detail) => {
        if (detail) {
          set.add(detail.projectName)
        }
      });
      set.forEach( (detail) => {
        item.projects += `${detail} `
      });

      item.time = `${item.year}年 第${item.week}周`;
      
      return item;
    });

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
          <Col span={20} offset={2}>
            <List
              style={{marginTop: 20, marginRight: 5}}
              header='已发送'
              itemLayout="horizontal"
              dataSource={dataSource}
              bordered
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Link to={{pathname: 'checkReport', query: {reportId: item.id}}}>收件人：{item.sendTo}</Link>}
                    description={<div>{item.copyTo ? <div>抄送给：{item.copyTo}</div> : ''}<div>发送时间：{item.time}</div>相关项目：{item.projects}</div>}
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

export default Form.create()( Send );
