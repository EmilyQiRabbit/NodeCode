import React, { Component } from 'react'
import { Link } from 'react-router'
import action from '../dataFile/action'
import { Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Form, Select, message } from 'antd'
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
import PropTypes from 'prop-types'

class Hack extends Component {

  static propTypes = {
    action: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  };

  handleSearchSubmit = (evt) => {
    evt.preventDefault();
    const { validateFields } = this.props.form;
    validateFields( ( err, values) => {
      if ( !err ) {
        action.postInfo({
          URL: `hack/delete${values.modelName}ById`,
          id: values.id
        }).then(() => {
          message.success( <action.Info>删除成功</action.Info> )
        })
      }
    } )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };

    return (
      <div>
        <Form
          onSubmit={this.handleSearchSubmit}
        >
          <Row>
            <Col span={20} offset={2} style={{paddingTop: 20, background: '#F5F5F5', marginTop: 30}}>
              <Col span={8} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label='id: '
                >
                  {getFieldDecorator('id', {

                  })(
                    <Input placeholder="请输入ID"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label='Model：'
                >
                  {getFieldDecorator('modelName', {

                  })(
                    <Select 
                      allowClear
                      showSearch // use that prop, then the select can be writen
                      className="withoutRadius"  
                      onSearch={this.handleProjectChange}
                      placeholder="请选择 Model">
                      <Select.Option key='Message' >Message</Select.Option>
                      <Select.Option key='Detail' >Detail</Select.Option>
                      <Select.Option key='Report' >Report</Select.Option>
                      <Select.Option key='User' >User</Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={3} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  <Button type="primary" htmlType="submit" size="default" style={{height: 30, lineHeight: '30px'}}>删除</Button>
                </FormItem>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()( Hack )
