import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Table, Form, Input, Select, Menu, Popconfirm, message, Modal, Button, Icon, Row, Col, AutoComplete } from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;

import action from '../app/action'

import {dateToString} from '../../utils/index';

class Users extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object,
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired
    } ).isRequired,
  }

  constructor (props) {
    super(props);

    /**
     * table头部
     * @type {*[]}
     */
    this.columns = [{
      title: '姓名',
      width: 100,
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '邮箱',
      width: 200,
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '注册时间',
      width: 200,
      dataIndex: 'createTime',
      key: 'register',
      render: (text) => {
        return dateToString(text);
      }
    }, 
    // {
    //   title: '状态',
    //   dataIndex: 'user_status',
    //   key: 'status',
    //   render: (text, record) => {
    //     const span = {
    //         text: '正常',
    //         color: '#093'
    //       };

    //     if (text === 0) {
    //       span.text = '禁用';
    //       span.color = '#ff0000';
    //     }

    //     return <span style={{color: span.color}}>{span.text}</span>;
    //   }
    // }, 
    {
      title: '权限',
      dataIndex: 'user_role',
      key: 'role',
      render: (text, record) => {
        switch (text) {
          case 999:
            return '管理员';
          default:
            return '一般用户';
        }
      }
    }, {
      title: '操作',
      render: (text, record, index) => {
        const statusText = record.user_status === 0 ? '激活' : '禁用',
          statusTextTip = `确定${statusText}此账号么?`;
        const roleText = record.user_role === 999 ? '取消管理员' : '设为管理员';
        const self = this;

        function handleUserRole () {
          self.handleUserRole(record, index)
        }
        function handleUserFroze () {
          self.handleUserFroze(record, index)
        }
        function handleUserDelete () {
          self.handleUserDelete(record, index)
        }

        function handleUserEdit() {
          self.handleUserEdit(record, index)
        }

        return (
          <span>
            <a href="#" onClick={handleUserRole}>{roleText}</a>
            <span className="ant-divider" />
            {/* <Popconfirm title={statusTextTip} onConfirm={handleUserFroze} >
              <a href="#">{statusText}</a>
            </Popconfirm> */}
            {/* <span className="ant-divider" /> */}
            <a href="#" onClick={handleUserEdit}>编辑</a>
            <span className="ant-divider" />

            <Popconfirm title="确定删除此账号么?" onConfirm={handleUserDelete} >
              <a href="#">删除</a>
            </Popconfirm>
          </span>
        )
      },
    }];
    this.state = {
      departmentList: [],
      noPermission: false,
      activeParams: {},
      searchParams: {},
      editParams: {},
      modalShow: false,
    }

    this.getUserList(1);
  }
  

  handleUserEdit = (record, index) => {
    const editParams = {
      userName: record.userName,
      userNameId: record._id,
      userCode: record.userCode,
      departmentName: record.departmentName,
      departmentId: record.departmentId,
      email: record.email,
      mobile: record.mobile,
      nickName: record.nickName,
      signature: record.signature,
      signatureEnable: record.signatureEnable,
      wechat: record.wechat,
      wechatActive: record.wechatActive
    }

    this.setState({
      modalShow: true,
      editParams
    });
  }

  /**
   * 根据 pageNum 获取用户列表
   * @param pageNum
   */
  getUserList = (pageNum) => {
    action.postInfo({
      URL: 'user/list',
      pageNum
    }).then((doc) => {
      this.setState({
        userList: doc.data.list,
        userTotal: doc.data.total,
        pageNum: doc.data.pageNum,
      })
    }).catch(err => {
      if ((err.code === '-1' && err.msg === '无权限') || err.toString() === 'Error: 无权限') {
        this.setState({
          noPermission: true
        })
      } else {
        message.error(<span>{err.toString()}</span>);
      }
    })
  }

  getDepartment = () => {
    action.postInfo({
      URL: 'department/list'
    }).then((doc) => {
      this.setState({
        departmentList: doc.data.list,
      })
    }).catch(err => {
      if ((err.code === '-1' && err.msg === '无权限') || err.toString() === 'Error: 无权限') {
        this.setState({
          noPermission: true
        })
      } else {
        message.error(<span>{err.toString()}</span>);
      }
    })
  }

  /**
   * 操作冻结/解冻用户
   * @param _id
   */
  handleUserFroze = (formdata, index) => {
    action.postInfo({
      index,
      _id: formdata._id,
      user_status: formdata.user_status === 1 ? 0 : 1
    }).then(data => {
      const text = formdata.user_status === 0 ? '激活' : '禁用';
      message.success(`${text}成功`);
      this.getUserList(1);
    }).catch(err => {
      message.error(err.msg);
    })
  }

  /**
   * 操作升级/降级用户
   * @param _id
   */
  handleUserRole = (formdata, index) => {
    action.postInfo({
      index,
      URL: 'user/role',
      _id: formdata._id,
      user_role: formdata.user_role === 999 ? 1 : 999
    }).then(data => {
      message.success('权限更改成功');
      this.getUserList(1);
    }).catch(err => {
      message.error(err.msg);
    })
  }
  

  /**
   * 操作删除用户
   * @param _id
   */
  handleUserDelete = (formdata, index) => {
    action.postInfo({
      index,
      URL: 'user/delete',
      _id: formdata._id,
    }).then(data => {
      message.success(<span>删除成功</span>);
      this.getUserList(1);
    }).catch(err => {
      message.error(<span>{err.msg}</span>);
    })
  }

  /**
   * 分页改变
   * @param page
   */
  handleTableChange = (pagination) => {
    this.getUserList(pagination.current);
  }

  handleOk = (e) => {
    const {generateData } = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = Object.assign({}, values);
        for (const key in params) {
          if (key.indexOf('_s') !== -1) {
            delete params[key];
          }
        }
        params.URL = 'user/update'
        action.postInfo(params).then(() => {
          message.success(<span>保存成功!</span>);
          this.getUserList(1);
          this.setState({
            modalShow: false,
          });
        })
      }
    });
  }

  handleCancel = (e) => {
    this.setState({
      modalShow: false,
    });
  }

  getModal = () => {
    const { modalShow, editParams } = this.state,
      { getFieldDecorator } = this.props.form,
      // { departmentList } = this.props,
      departmentList = [],
      { getPopupContainer, generateData, handleOk, handleCancel } = this,
      { userName, userNameId, nickName, userCode, email, departmentId, departmentName, mobile, signature, signatureEnable, wechat, wechatActive } = editParams,
      formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      };
    const userNameLabel = (<FormItem {...formItemLayout} label="用户名称">
      {getFieldDecorator('userName', {
        initialValue: (userName != null) ? userName : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    const idLabel = (<FormItem {...formItemLayout} label="用户ID">
      {getFieldDecorator('_id', {
        initialValue: (userNameId != null) ? userNameId : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    const emailLabel = (<FormItem {...formItemLayout} label="邮箱">
      {getFieldDecorator('email', {
        initialValue: (email != null) ? email : null,
      })(
        <Input autoComplete="off" disabled/>
      )}
    </FormItem>)
    const mobileLabel = (<FormItem {...formItemLayout} label="手机">
      {getFieldDecorator('mobile', {
        initialValue: (mobile != null) ? mobile : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    // const wechatLabel = (<FormItem {...formItemLayout} label="微信">
    //   {getFieldDecorator('wechat', {
    //     initialValue: (wechat != null) ? wechat : null,
    //   })(
    //     <Input autoComplete="off"/>
    //   )}
    // </FormItem>)
    const nickNameLabel = (<FormItem {...formItemLayout} label="花名">
      {getFieldDecorator('nickName', {
        initialValue: (nickName != null) ? nickName : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    const signatureLabel = (<FormItem {...formItemLayout} label="个性签名">
      {getFieldDecorator('signature', {
        initialValue: (signature != null) ? signature : null,
      })(
        <TextArea style={{height: '75px'}}/>
      )}
    </FormItem>)
    // const wxStatusLabel = (<FormItem {...formItemLayout} label="微信激活状态">
    //   {getFieldDecorator('wechatActive', {
    //     initialValue: wechatActive ? '1' : '0',
    //   })(
    //     <Select
    //       getPopupContainer={getPopupContainer}
    //     >
    //       <Option value="1">已激活</Option>
    //       <Option value="0">未激活</Option>
    //     </Select>
    //   )}
    // </FormItem>)
    return (
      <Modal
        title="用户编辑"
        width="500px"
        className="modalPop"
        visible={modalShow}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          className="ant-advanced-search-form search-form"
        >
          <Row className="search-panel">
            { userNameLabel }
            {/*{ departmentLabel }*/}
            { emailLabel }
            { mobileLabel }
            { nickNameLabel }
            { signatureLabel }
          </Row>
        </Form>
      </Modal>
    )
  }

  // 搜索框区域
  getField = () => {
    const { userName, departmentName, nickName } = this.state.searchParams,
      { getFieldDecorator } = this.props.form,
      // { departmentList } = this.props,
      departmentList = [],
      { getPopupContainer, onSelect, generateData } = this,
      formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      };
    const nameLabel = (<FormItem {...formItemLayout} label="用户名">
      {getFieldDecorator('userName_s', {
        initialValue: (userName != null) ? userName : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    const departmentOptions = this.state.departmentList.map((item) => {
      return <Option key={item.departmentName}>{item.departmentName}</Option>;
    });
    const departmentLabel = (<FormItem
      {...formItemLayout}
      label='部门：'
    >
      {getFieldDecorator('departmentName_s', {
        initialValue: departmentName,
      })(
        <Select allowClear onFocus={this.getDepartment}>
          {departmentOptions}
        </Select>
      )}
    </FormItem>)
    const emailLabel = (<FormItem {...formItemLayout} label="花名">
      {getFieldDecorator('nickName_s', {
        initialValue: (nickName != null) ? nickName : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>)
    const btnLabel = (<FormItem {...formItemLayout} label="">
      {getFieldDecorator('search', {
        
      })(
        <Button type="primary" htmlType="submit" style={{marginLeft: '33%'}}>搜索</Button>
      )}
    </FormItem>);
    const firstCol = (<Row className="search-panel"><Col span={6} key={0} >
      {nameLabel}
    </Col><Col span={6} key={1} >
      {departmentLabel}
    </Col><Col span={6} key={2} >
      {emailLabel}
    </Col><Col span={6} key={3} >
      {btnLabel}
    </Col></Row>)
    return firstCol;
  }

  //将参数转换为 key1=value1&key2=value2 的形式放到路由中
  generateQueryStr = ( object ) => {
    const arr = [];
    for ( const i in object ) {
      if ( object[i] ) {
        arr.push( `${i}=${window.encodeURIComponent( object[i] || '' )}`)
      }
    }
    return arr.join( '&' )
  }

  handleUserSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    let { searchParams } = this.state;
    const { generateQueryStr } = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        searchParams = {
          userName: values.userName_s,
          departmentName: values.departmentName_s,
          nickName: values.nickName_s,
          URL: 'user/list'
        }
        const { router } = this.props;
        searchParams.pageNum = 1;
        action.postInfo(searchParams).then((doc) => {
          this.setState({
            userList: doc.data.list,
            pageNum: doc.data.pageNum,
          })
        });
        delete searchParams.URL
        this.setState(searchParams);
      }
    });
  }


  render() {
    const { modalShow, noPermission } = this.state;
    const list = this.state.userList;
    const pagination = {
      defaultCurrent: 1,
      current: this.state.pageNum,
      total: this.state.userTotal
    }
    const { handleUserSearch } = this;
    const modalPanel = this.getModal(),
      searchPanel = this.getField();

    return (
      <div>
        {
          noPermission ?
            <div>
              <h3 className="no-per-title">抱歉，暂无查看权限！</h3>
              <div className="no-per"></div>
            </div>
            :
            <div>
              <div className="pannel-block">
                <Form
                  className="ant-advanced-search-form search-form"
                  onSubmit={handleUserSearch}
                >
                  {searchPanel}
                </Form>
              </div>
              <Table
                bordered
                rowKey="_id"
                columns={this.columns}
                dataSource={list}
                className="mt20"
                pagination={pagination}
                onChange={this.handleTableChange}
              />
              { modalPanel }
            </div>
        }
      </div>
    )
  }

}

export default Form.create()(Users);

