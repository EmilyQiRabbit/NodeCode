import React, { Component } from 'react'
import action from '../dataFile/action'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Select } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
import PropTypes from 'prop-types'

class Login extends Component {

  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
    } ).isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    // 登录
    const { validateFields } = this.props.form;
    const { router } = this.props;
    validateFields( (err, values) => {
      if ( !err ) {
        action.postInfo( Object.assign({
          URL: 'user/login',
        }, values) ).then((data) => {
          window.INIT_DATA.userinfo = data.data;
          window.localStorage.setItem('userinfo', JSON.stringify(data.data));
          router.push('/received')
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

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <Row>
            <Col className='loginPanel'>
              <Col span={10} offset={6} style={{marginBottom: 30}}>
                <h2><Icon type="login"/> 请登录</h2>
                <h4>欢迎来码周报 \(# ^~^ #)/</h4>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='邮箱：'
                >
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输入邮箱📮' }],
                  })(
                    <Input placeholder="请输入邮箱" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <FormItem
                  {...formItemLayout}
                  label='密码：'
                >
                  {getFieldDecorator('password', {
                    //rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input placeholder="请输入密码" autoComplete='off'/>
                  )}
                </FormItem>
              </Col>
              <Col span={10} offset={6}>
                <Button type="primary" htmlType="submit" size="default" style={{float: 'right', marginRight: '4%'}}>登录</Button>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()( Login );
