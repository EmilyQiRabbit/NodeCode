import React, { Component } from 'react'
import action from '../dataFile/action'
import Immutable from 'immutable'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Select, message } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
import PropTypes from 'prop-types'

class UserCenter extends Component {

  static propTypes = {
    action: PropTypes.object,
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
    } ).isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(options) {
    super(options);
    if (window.INIT_DATA.userinfo) {
      action.postInfo({
        URL: 'user/detail',
        email: window.INIT_DATA.userinfo.email
      }).then((doc) => {
        this.setState({
          userInfo: doc.data
        })
      })
    }
    this.state = {
      userInfo: {},
      departmentList: []
    }
    // The departments info can be queried until user click the department input form, 
    // according to ‘薛定谔的猫’(笑) said by somebody.
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    // 保存
    const { validateFields } = this.props.form;
    const { router } = this.props;
    validateFields( ( err, values) => {
      if ( !err ) {
        action.postInfo( Object.assign({
          URL: 'user/update',
          email: window.INIT_DATA.userinfo.email,
        }, values) ).then(() => {
          message.success(<action.Info>修改成功！</action.Info>)
        });
      }
    } )
  };

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    const userInfo = this.state.userInfo;

    const dList = this.state.departmentList;
    const opArray = dList ? Array.from(dList).map((department) => {
      const option = <Option key={department.departmentName} value={department.departmentName}>{department.departmentName}</Option>
      //item.content = `${item.content.slice(0, 10)}...`;
      return option;
    }) : [];

    const getDepartmentList = () => {
      action.postInfo({
        URL: 'department/list',
      }).then((doc) => {
        this.setState({
          departmentList: doc.data.list
        })
      })
    }

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <Row>
            <Col className='loginPanel'>
              <Col span={12} offset={5} style={{marginBottom: 50}}>
                <h2>个人信息</h2>
                <h4>请完善您的个人资料，会在周报中显示</h4>
              </Col>
              <Col span={10} offset={5}>
                <FormItem
                  {...formItemLayout}
                  label='花名：'
                >
                  {getFieldDecorator('nickName', {
                    initialValue: userInfo.nickName,
                    rules: [{ required: true, message: '请输入花名' }],
                  })(
                    <Input placeholder="请输入花名" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={5}>
                <FormItem
                  {...formItemLayout}
                  label='用户姓名：'
                >
                  {getFieldDecorator('userName', {
                    initialValue: userInfo.userName,
                    rules: [{ required: true, message: '请输入用户姓名' }],
                  })(
                    <Input placeholder="请输入用户姓名" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={5}>
                <FormItem
                  {...formItemLayout}
                  label='邮箱地址：'
                >
                  {getFieldDecorator('email', {
                    initialValue: userInfo.email,
                    rules: [{ required: true, message: '请输入邮箱📮' }],
                  })(
                    <Input placeholder="请输入邮箱📮地址" autoComplete='off' disabled/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={5}>
                <FormItem
                  {...formItemLayout}
                  label='所属部门：'
                >
                  {getFieldDecorator('departmentName', {
                    initialValue: userInfo.departmentName,
                    rules: [{ required: true, message: '请选择部门' }],
                  })(
                    <Select allowClear onFocus={getDepartmentList}>
                      {opArray}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={5}>
                <FormItem
                  {...formItemLayout}
                  label='个人签名：'
                  initialValue={userInfo.signature}
                >
                  {getFieldDecorator('signature', {
                    initialValue: userInfo.signature,
                    rules: [{ required: true, message: '请输入个人签名' }],
                  })(
                    <Input placeholder="请输入个人签名" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={5}>
                <Button type="primary" htmlType="submit" size="default" style={{float: 'right', marginRight: '4%'}}>保存</Button>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()( UserCenter );
