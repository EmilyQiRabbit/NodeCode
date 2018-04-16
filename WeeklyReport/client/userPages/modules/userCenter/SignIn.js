import React, { Component } from 'react'
import action from '../dataFile/action'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Select, message } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
import PropTypes from 'prop-types'

class SignIn extends Component {

  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
      getFieldValue: PropTypes.func.isRequired,
    } ).isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor( options ) {
    super(options)
    this.state = {
      departmentList: []
    }
    action.postInfo({
      URL: 'department/list',
    }).then((data) => {
      this.setState({
        departmentList: data.data.list
      })
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    // 注册
    const { validateFields } = this.props.form;
    const { router } = this.props;
    validateFields( ( err, values) => {
      if ( !err ) {
        action.postInfo( Object.assign({
          URL: 'user/add',
        }, values) ).then((data) => {
          router.push('/login')
        }).catch((err) => {
          console.log(err)
          message.error( <action.Info>{err.toString()}</action.Info> )
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
    const opArray = this.state.departmentList.map((department) => {
      const option = <Option key={department.departmentName}>{department.departmentName}</Option>
      //item.content = `${item.content.slice(0, 10)}...`;
      return option;
    });

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <Row>
            <Col className='loginPanel'>
              <Col span={10} offset={6} style={{marginBottom: 30}}>
                <h2><Icon type="plus-circle-o"/> 用户注册</h2>
                <h4>欢迎来码周报 \(# ^~^ #)/</h4>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='用户姓名：'
                >
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户姓名' }],
                  })(
                    <Input placeholder="请输入用户姓名" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='邮箱：'
                >
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: '请输入邮箱📮' },
                      { pattern: /^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$/, message: '邮箱格式错误🙅' }
                    ],
                  })(
                    <Input placeholder="请输入邮箱" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='部门：'
                >
                  {getFieldDecorator('departmentName', {
                    rules: [{ required: true, message: '请选择部门' }],
                  })(
                    <Select allowClear>
                      {opArray}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='密码：'
                >
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input placeholder="请输入密码" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='确认密码：'
                >
                  {getFieldDecorator('passwordConfirm', {
                    rules: [{ required: true, message: '请确认密码' }, {
                      validator: (rule, value, callback) => {
                        const { getFieldValue } = this.props.form
                        if (value && value !== getFieldValue('password')) {
                            callback('两次输入不一致 >.<')
                        }
                        callback() // 注意，callback 必须被调用。
                      }
                    }],
                  })(
                    <Input placeholder="请再次输入密码" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <Button type="primary" htmlType="submit" size="default" style={{float: 'right', marginRight: '4%'}}>注册</Button>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()( SignIn );
