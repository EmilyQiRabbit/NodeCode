import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import { Button, Table, Form, Input, Select, message, Menu, Row, Col, Modal, DatePicker, Icon } from 'antd';
import tool from '../tool.js'
import action from '../app/action'

const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;

class ProjectManage extends Component {
  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired
    } ).isRequired,
  }
  constructor(options) {
    super(options)
    this.state = {
      noPermission: false,
      searchParams: {},
      editParams: {},
      departmentList: [],
      projectList: []
    }
    this.getProjectList();
  }

  getProjectList() {
    action.postInfo({
      URL: 'project/list'
    }).then((doc) => {
      this.setState({
        projectList: doc.data.list
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

  editProject = (record, e) => {
    const editParams = {
      projectName: record.projectName,
      projectType: record.projectType,
      projectId: record._id,
      projectDesc: record.projectDesc,
      projectDepartment: record.projectDepartment,
    }
    if (!this.state.departmentList.length) {
      action.postInfo({
        URL: 'department/list'
      }).then((doc) => {
        this.setState({
          departmentList: doc.data.list
        })
      })
    }
    this.setState({
      modalShow: true,
      editParams,
      modalType: 'edit'
    });
  }

  deleteProject = (_id, e) => {
    const params = {
      _id,
      URL: 'project/delete'
    };
    action.postInfo(params).then(() => {
      message.success(<span>删除成功！</span>)
      this.getProjectList();
    }).catch((err) => {
        message.error(<span>{err}</span>)
      })
  }

  getColumns = (type) => {
    const { editProject, deleteProject } = this;
    const columns = [{
      key: 'projectName',
      title: '项目名称',
      dataIndex: 'projectName'
    }, {
      key: 'projectType',
      title: '项目类型',
      dataIndex: 'projectType',
      render: (text, record) => (
        <span>
          {
            (function() {
              let inner;
              if (record.projectType) {
                inner = '真实项目';
              } else {
                inner = '虚拟项目'
              }
              return inner;
            })()
          }
        </span>
      )
    }, {
      key: 'projectDesc',
      title: '项目描述',
      dataIndex: 'projectDesc'
    }, {
      key: 'projectDepartment',
      title: '所属部门',
      dataIndex: 'projectDepartment'
    }, {
      key: 'options',
      title: '操作',
      dataIndex: 'options',
      render: (text, record) => {
        function editpro() {
          editProject(record)
        }
        function deletepro() {
          deleteProject(record._id)
        }
        return (<span>
          <span className="table-option" onClick={editpro}>编辑</span>
          <span className="table-option" onClick={deletepro}>删除</span>
        </span>)
      }

    }];
    return columns;
  }

  getPopupContainer = triggerNode => triggerNode.parentNode;

  //新增项目框
  getAddField= () => {
    const { projectNameAdd, projectDesc } = this.state.searchParams,
      { getFieldDecorator } = this.props.form,
      { getPopupContainer, onSelect } = this,
      formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      //搜索区域内容的集合
      children = [];
    const nameLabel = (<FormItem {...formItemLayout} label="项目名称">
      {getFieldDecorator('projectNameAdd', {
        initialValue: (projectNameAdd != null) ? projectNameAdd : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>);
    const typeLabel = (<FormItem {...formItemLayout} label="项目类型">
      {getFieldDecorator('projectTypeAdd', {
      })(
        <Select
          getPopupContainer={getPopupContainer}
          placeholder="请选择项目类型"
        >
          <Option key='real' value="1">真实项目</Option>
          <Option key='virtual' value="2">虚拟项目</Option>
        </Select>
      )}
    </FormItem>);

    const departmentData = this.state.departmentList.map((item) => {
      return <Option key={item.departmentName}>{item.departmentName}</Option>;
    });

    const departmentLabel = (<FormItem {...formItemLayout} label="项目所属部门">
      {getFieldDecorator('projectDepartmentAdd', {
      })(
        <Select
          getPopupContainer={getPopupContainer}
          placeholder="请选择项目所属部门"
        >
          { departmentData }
        </Select>
      )}
    </FormItem>);
    const btnLabel = (<span>
      <span className="ant-col-5"></span>
      <Button type="primary" htmlType="submit">添加</Button>
    </span>);
    const descLabel = (<FormItem {...formItemLayout} label="项目描述">
      {getFieldDecorator('projectDescAdd', {
        initialValue: (projectDesc != null) ? projectDesc : null,
      })(
        <TextArea style={{height: '75px'}}/>
      )}
    </FormItem>);
    children.push(nameLabel, typeLabel, departmentLabel, descLabel);
    return children;
  }
  //搜索框区域
  getSearchField = () => {
    const { projectNameSearch } = this.state.searchParams,
      { getFieldDecorator } = this.props.form,
      { getPopupContainer, onSelect } = this,
      formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      //搜索区域内容的集合
      children = [];
    const nameLabel = (<FormItem {...formItemLayout} label="项目名称">
      {getFieldDecorator('projectNameSearch', {
        initialValue: (projectNameSearch != null) ? projectNameSearch : null,
      })(
        <Input autoComplete="off"/>
      )}
    </FormItem>);
    const btnLabel = (<span>
      <span className="ant-col-5"></span>
      <Button type="primary" htmlType="submit">搜索</Button>
    </span>);
    const firstCol = (<Col span={8} key={0} >
      {nameLabel}
      {btnLabel}
    </Col>)
    children.push(firstCol);
    return children;
  }

  handleProjectSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const searchParams = {
          projectName: values.projectNameSearch,
          URL: 'project/list'
        };
        action.postInfo(searchParams).then((doc) => {
          this.setState({
            projectList: doc.data.list
          })
        })
      }
    });
  }

  handleProjectAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const addParams = {
          projectName: values.projectNameAdd,
          projectType: (values.projectTypeAdd === '1'),
          projectDesc: values.projectDescAdd,
          projectDepartment: values.projectDepartmentAdd,
          URL: 'project/add'
        };
        action.postInfo(addParams).then(() => {
          message.success(<span>添加成功！</span>)
          this.getProjectList();
          this.setState({
            modalShow: false,
          });
        }).catch((err) => {
          message.error(<span>{err}</span>)
        });
      }
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

  getPopupContainer = triggerNode => triggerNode.parentNode;

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          projectName: values.projectName,
          projectType: (values.projectType === '1'),
          projectDesc: values.projectDesc,
          projectDepartment: values.projectDepartment,
          _id: values._id,
          URL: 'project/update'
        };
        action.postInfo(params).then(() => {
          message.success(<action.Info>修改成功！</action.Info>)
          this.setState({
            modalShow: false,
          });
          this.getProjectList();
        }).catch((err) => {
          message.error(<span>{err}</span>)
        })
      }
    });
  }

  handleCancel = () => {
    this.setState({
      modalShow: false,
    });
  }

  getModal = () => {
    const { modalShow, editParams, modalType } = this.state,
      { handleOk, handleProjectAdd, handleCancel, getPopupContainer } = this;
    if (modalType === 'add') {
      const labels =  this.getAddField();
      return (
        <Modal
          title="添加项目"
          width="500px"
          className="modalPop"
          visible={modalShow}
          onOk={handleProjectAdd}
          onCancel={handleCancel}
        >
          <Form
            className="ant-advanced-search-form search-form"
          >
            <Row key='add-panel' className="search-panel">
              { labels }
            </Row>
          </Form>
        </Modal>
      )
    } else {
        const { getFieldDecorator } = this.props.form,
        { projectName, projectType, projectId,  projectDesc, projectDepartment} = editParams,
        formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        };
      const projectNameLabel = (<FormItem {...formItemLayout} label="项目名称">
        {getFieldDecorator('projectName', {
          initialValue: (projectName != null) ? projectName : null,
        })(
          <Input autoComplete="off"/>
        )}
      </FormItem>)
      const projectTypeLabel = (<FormItem {...formItemLayout} label="项目类型">
        {getFieldDecorator('projectType', {
          initialValue: projectType ? '1' : '0',
        })(
          <Select
            getPopupContainer={getPopupContainer}
          >
            <Option key='real' value="1">真实项目</Option>
            <Option key='virtual' value="0">虚拟项目</Option>
          </Select>
        )}
      </FormItem>);
      const departmentData = this.state.departmentList.map((item) => {
        return <Option key={item.departmentName}>{item.departmentName}</Option>;
      });
      const departmentLabel = (<FormItem {...formItemLayout} label="项目所属部门">
        {getFieldDecorator('projectDepartment', {
          initialValue: (projectDepartment != null) ? projectDepartment : null,
        })(
          <Select
            getPopupContainer={getPopupContainer}
            placeholder="请选择项目所属部门"
          >
            { departmentData }
          </Select>
      )}
      </FormItem>);
      const idLabel = (<FormItem {...formItemLayout} label="项目ID">
        {getFieldDecorator('_id', {
          initialValue: (projectId != null) ? projectId : null,
        })(
          <Input autoComplete="off"/>
        )}
      </FormItem>)

      const signatureLabel = (<FormItem {...formItemLayout} label="项目描述">
        {getFieldDecorator('projectDesc', {
          initialValue: (projectDesc != null) ? projectDesc : null,
        })(
          <TextArea style={{height: '75px'}}/>
        )}
      </FormItem>)
      return (
        <Modal
          title="项目编辑"
          width="500px"
          className="modalPop"
          visible={modalShow}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            className="ant-advanced-search-form search-form"
          >
            <Row key='edit-panel' className="search-panel">
              { projectNameLabel }
              { projectTypeLabel }
              { departmentLabel }
              { signatureLabel }
            </Row>
          </Form>
        </Modal>
      )
    }
  }

  /**
   * 新增项目
   *
   */
  handleAddPage = () => {
    if (!this.state.departmentList.length) {
      action.postInfo({
        URL: 'department/list'
      }).then((doc) => {
        this.setState({
          departmentList: doc.data.list
        })
      })
    }
    this.setState({
      modalShow: true,
      modalType: 'add'
    })
  }

  render() {
    const { getColumns, getSearchField, getAddField, handleProjectSearch, handleProjectAdd, generateTableData, getModal  } = this,
      { searchParams, noPermission } = this.state,
      projectCol = getColumns(),
      searchPanel = getSearchField(),
      addPanel = getAddField(),
      modalPanel = getModal();
    const data = this.state.projectList;
    return (
      <div>
        {
          noPermission ?
            <div>
              <h3 className="no-per-title">抱歉，暂无查看权限！</h3>
              <div className="no-per"></div>
            </div>
            :
            <div className='main-content project-manage'>
              <Button style={{float: 'right', marginBottom: 15, zIndex: 5}} type="primary" onClick={this.handleAddPage}><Icon type="file-add" />新增项目</Button>
              <Table
                columns={projectCol}
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

export default Form.create()(ProjectManage);
