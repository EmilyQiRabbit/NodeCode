import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import { Button, Table, Form, Menu, Input, message, Select, Row, Col, Modal, DatePicker, AutoComplete, Icon } from 'antd';
import tool from '../tool.js'
import action from '../app/action'

const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;

class Department extends Component {
  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired
    } ).isRequired,
  }
  constructor(options) {
    super(options)
    this.state = {
      departmentList: [],
      noPermission: false,
      searchParams: {},
      editParams: {},
      modalShow: false,
      modalType: 'add'
    }
    this.getDepartmentList();
  }

  getDepartmentList() {
    action.postInfo({
      URL: 'department/list'
    }).then(() => {
      
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

  editDepartment = (record, e) => {
    const editParams = {
      departmentName: record.departmentName,
      departmentNameId: record._id,
      departmentDesc: record.departmentDesc,
    }

    this.setState({
      modalShow: true,
      editParams,
      modalType: 'edit'
    });
  }

  deleteDepartment = (_id, e) => {
    const params = {
      _id
    };
    action.postInfo(params);
    this.getDepartmentList()
  }

  getColumns = () => {
    const { editDepartment, deleteDepartment } = this;
    const columns = [{
      key: 'departmentName',
      title: '部门名称',
      dataIndex: 'departmentName'
    }, {
      key: 'departmentDesc',
      title: '部门描述',
      dataIndex: 'departmentDesc'
    }, {
      key: 'updateTime',
      title: '状态更新时间',
      dataIndex: 'updateTime'
    }, {
      key: 'options',
      title: '操作',
      dataIndex: 'options',
      render: (text, record) => {
        function editDep() {
          editDepartment(record);
        }
        function deleteDep() {
          deleteDepartment(record._id);
        }
        return (<span>
          <span className="table-option" onClick={editDep}>编辑</span>
          <span className="table-option" onClick={deleteDep}>删除</span>
        </span>);
      }

    }];
    return columns;
  }

  getPopupContainer = triggerNode => triggerNode.parentNode;

  onSelect = () => {
    // console.log('onSelect');
  }

  //新增部门框
  getAddField= () => {
    const { departmentDesc, departmentNameAdd } = this.state.searchParams,
      { getFieldDecorator } = this.props.form,
      { getPopupContainer, onSelect } = this,
      formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      children = [];
    const nameLabel = (<FormItem {...formItemLayout} label="部门名称">
      {getFieldDecorator('departmentNameAdd', {
        initialValue: (departmentNameAdd != null) ? departmentNameAdd : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>);
    const btnLabel = (<span>
      <span className="ant-col-5"></span>
      <Button type="primary" htmlType="submit">添加</Button>
    </span>);
    const descLabel = (<FormItem {...formItemLayout} label="部门描述">
      {getFieldDecorator('departmentDescAdd', {
        initialValue: (departmentDesc != null) ? departmentDesc : null,
      })(
        <TextArea style={{height: '75px'}}/>
      )}
    </FormItem>);
    children.push(nameLabel, descLabel);
    return children;
  }
  //搜索框区域
  getSearchField = () => {
    const { departmentNameSearch } = this.state.searchParams,
      { getFieldDecorator } = this.props.form,
      { getPopupContainer, onSelect } = this,
      formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      //搜索区域内容的集合
      children = [];
    const nameLabel = (<FormItem {...formItemLayout} label="部门名称">
      {getFieldDecorator('departmentName_s', {
        initialValue: (departmentNameSearch != null) ? departmentNameSearch : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>);
    const btnLabel = (<span>
      <span className="ant-col-5"></span>
      <Button type="primary" htmlType="submit">搜索</Button>
    </span>);
    const firstCol = (<Col span={12} key={0} >
      {nameLabel}
      {btnLabel}
    </Col>)
    children.push(firstCol);
    return children;
  }

  handleDepartmentSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const searchParams = {
          departmentName: values.departmentName_s,
        };
        action.postInfo(searchParams);
      }
    });
  }

  handleDepartmentAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const addParams = {
          departmentName: values.departmentNameAdd,
          departmentDesc: values.departmentDescAdd
        };
        action.postInfo(addParams);
        this.getDepartmentList()
      }
    });
    this.setState({
      modalShow: false,
    });
  }

  formateTime = (timeStamp) => {
    let fTime = timeStamp;
    if (fTime != null) {
      //将表格中的时间数据从时间戳转换为 2017-09-05 13:45:28 的形式
      fTime = tool.formatTime({time: fTime, showMs: false, showYear: true});
    }
    return fTime;
  }

  //给表格中的数据添加key属性，格式化时间戳
  generateTableData = ( list ) => {
    const { formateTime } = this;
    return list.map( ( item, index ) => {
      item.key = `key${index}`;
      item.updateTime = formateTime(item.updateTime);
      return item
    } )
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = Object.assign({}, values);
        for (const key in params) {
          if (key.indexOf('_s') !== -1) {
            delete params[key];
          }
        }
        action.postInfo(params);
        this.getDepartmentList()
      }
    });
    this.setState({
      modalShow: false,
    });
  }

  handleCancel = () => {
    this.setState({
      modalShow: false,
    });
  }

  getModal = () => {
    const { modalShow, editParams, modalType } = this.state,
      { handleOk, handleDepartmentAdd, handleCancel } = this;
      if (modalType === 'add') {
      const labels =  this.getAddField();
      return (
        <Modal
          title="添加部门"
          width="500px"
          className="modalPop"
          visible={modalShow}
          onOk={handleDepartmentAdd}
          onCancel={handleCancel}
        >
          <Form
            className="ant-advanced-search-form search-form"
          >
            <Row className="search-panel">
              { labels }
            </Row>
          </Form>
        </Modal>
      )
    } else {
      const { getFieldDecorator } = this.props.form,
        { departmentName, departmentDesc, departmentNameId } = editParams,
        formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        };
      const userNameLabel = (<FormItem {...formItemLayout} label="部门名称">
        {getFieldDecorator('departmentName', {
          initialValue: (departmentName != null) ? departmentName : null,
        })(
          <Input autoComplete="off"/>
        )}
      </FormItem>)
      const idLabel = (<FormItem {...formItemLayout} label="部门ID">
        {getFieldDecorator('_id', {
          initialValue: (departmentNameId != null) ? departmentNameId : null,
        })(
          <Input autoComplete="off"/>
        )}
      </FormItem>)

      const signatureLabel = (<FormItem {...formItemLayout} label="部门描述">
        {getFieldDecorator('departmentDesc', {
          initialValue: (departmentDesc != null) ? departmentDesc : null,
        })(
          <TextArea style={{height: '75px'}}/>
        )}
      </FormItem>)
      return (
        <Modal
          title="部门编辑"
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
              { signatureLabel }
            </Row>
          </Form>
        </Modal>
      )
    }
  }

  /**
   * 新增部门
   *
   */
  handleAddPage = () => {
    this.setState({
      modalShow: true,
      modalType: 'add'
    })
  }

  render() {
    const { getColumns, getSearchField, getAddField, handleDepartmentSearch, handleDepartmentAdd, generateTableData, getModal  } = this,
      { searchParams, noPermission } = this.state,
      departmentCol = getColumns(),
      searchPanel = getSearchField(),
      addPanel = getAddField(),
      modalPanel = getModal();
    const data = this.state.departmentList
    const current = 2;
    const total = 12;
    const pageSize = 10;
    const pagination = {
      current,
      total,
      pageSize,
      showSizeChanger: true,
      onChange: ( page, pageSize ) => {
        searchParams.pageNum  = page;
        searchParams.pageSize = pageSize;
        // router.push( `/report?${generateQueryStr(searchParams)}` );
        // reportAction.getReportList(searchParams);
        this.getDepartmentList()
      },
      onShowSizeChange: ( page, pageSize ) => {
        searchParams.pageNum  = page;
        searchParams.pageSize = pageSize;
        // router.push( `/report?${generateQueryStr(searchParams)}` );
        // reportAction.getReportList(searchParams);
        this.getDepartmentList()
      }
    }
    return (
      <div>
        {
          noPermission ?
            <div>
              <h3 className="no-per-title">抱歉，暂无查看权限！</h3>
              <div className="no-per"></div>
            </div>
            :
            <div className='main-content department-manage'>
              <Button style={{float: 'right', marginBottom: '15px', zIndex: 5}} type="primary" onClick={this.handleAddPage}><Icon type="file-add" />新增部门</Button>
              <Table
                columns={departmentCol}
                dataSource={data}
                pagination={false}
              ></Table>
              { modalPanel }
            </div>
        }
      </div>
    )
  }
}

export default Form.create()(Department);
