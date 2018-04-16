import React, { Component } from 'react'
import { Link } from 'react-router'
import action from '../dataFile/action'
import moment from 'moment'
import { Form, Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, Modal, Select, message } from 'antd'
const SelectOption = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const FormItem = Form.Item;
const { Header, Footer, Sider, Content } = Layout;
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'; // React的DOM方法

class NewReport extends Component {

  static propTypes = {
    form: PropTypes.shape( {
      getFieldDecorator: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired,
      resetFields: PropTypes.func.isRequired,
    } ).isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object,
  };

  constructor( options ) {
    super( options );
    const { location } = this.props;
    const { query } = location;

    this.state = {
      modalVisible: false,
      userDataSource: [],
      // sendToArray: [], // 发送给
      // copyToArray: [], // 抄送给
      thisWeekProject: {}, // 本周添加的新项目 --> format: {projectName: {week, content}}
      nextWeekProject: {}, // 下周添加的新项目
      copyTo: [],
      sendTo: [],
      projectCurrent: [], // selete initialValue
      projectNext: [],
      // Data from db
      receivedList: [],
      userInfo: [],
      projectList: [],
      sendedList: [],
      savedReport: []
    }

    if (window.INIT_DATA.userinfo) {
      action.postInfo({
        URL: 'project/list',
      }).then((doc) => {
        this.setState({
          projectList: doc.data.list
        })
      })
      action.postInfo({
        userId: window.INIT_DATA.userinfo.id,
        URL: 'draft/saved'
      }).then((doc) => {
        const savedReport = doc.data.list;
        if (savedReport && savedReport.length) {
          const sendedMsg = savedReport[0];
          this.doWithReportAlreadyHas(sendedMsg);
          this.setState({
            savedReport
          })
        }
      })
    }
  }

  doWithReportAlreadyHas = (sendedMsg) => {
    if (sendedMsg && sendedMsg.details && sendedMsg.details.length) {
      const thisWeekProject = {}, nextWeekProject = {}, projectCurrent = [], projectNext = [];
      sendedMsg.details.forEach((detail) => {
        if (detail.type === 0) { // This week
          projectCurrent.push(detail.projectName);
          thisWeekProject[detail.projectName] = {week: detail.week, content: detail.content}
        } else if (detail.type === 1) { // Next week
          projectNext.push(detail.projectName);
          nextWeekProject[detail.projectName] = {week: detail.week, content: detail.content}
        }
        this.projectMap[detail.projectName] = detail.projectId
      })
      this.setState({thisWeekProject, nextWeekProject, projectCurrent, projectNext})
    }
    if (sendedMsg && sendedMsg.sendTo && sendedMsg.sendTo.length) {
      const sendTo = [];
      sendedMsg.sendTo.forEach((user) => {
        if (user) {
          sendTo.push(user.userName)
          this.userMap[user.userName] = user.id;
        }
      })
      this.setState({
        sendTo
      })
    }
    if (sendedMsg && sendedMsg.copyTo && sendedMsg.copyTo.length) {
      const copyTo = [];
      sendedMsg.copyTo.forEach((user) => {
        if (user) {
          copyTo.push(user.userName)
          this.userMap[user.userName] = user.id;
        }
      })
      this.setState({
        copyTo
      })
    }
  }
  
  thisWeekProject = {};
  nextWeekProject = {};

  saveNewReport = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        const report = {};
        const details = [];
        for (const key in values) { // details
          if (key) {
            const detail = {};
            if (key.indexOf('thisWeekProjectName') > -1) {
              detail.type = 0;
              detail.projectName = key.replace('thisWeekProjectName', '');
              detail.projectId = this.projectMap[detail.projectName];
              detail.content = values[key];
              details.push(detail);
            } else if (key.indexOf('nextWeekProjectName') > -1) {
              detail.type = 1;
              detail.projectName = key.replace('nextWeekProjectName', '');
              detail.projectId = this.projectMap[detail.projectName];
              detail.content = values[key];
              details.push(detail);
            }
          }
        }
        // messages
        const messages = [];
        values.sendTo.forEach((sendName) => {
          const message = {};
          message.to = this.userMap[sendName];
          message.from = window.INIT_DATA.userinfo.id;
          message.type = 0;
          messages.push(message);
        })
        if (values.copyTo) {
          values.copyTo.forEach((sendName) => {
            const message = {};
            message.to = this.userMap[sendName];
            message.from = window.INIT_DATA.userinfo.id;
            message.type = 1;
            messages.push(message);
          })
        }
        report.details = details;
        report.messages = messages;
        report.email = window.INIT_DATA.userinfo.email;
        report.userId = window.INIT_DATA.userinfo.id;
        report.status = 0; // 未发送
        action.postInfo({
          report,
          URL: 'draft/create'
        }).then(() => {
          message.success( <action.Info>保存成功</action.Info> )
        })
      }
    } );
  }

  showImportModel = () => {
    const { form } = this.props;
    const week = moment().weeks();
    const year = moment().years();

    const thisWeekProject = {};
    const nextWeekProject = {};
    
    form.validateFieldsAndScroll( ( err, values ) => {
      console.log(err, values);
      for (const key in values) { // Load current projects on panel
        if (key && key.indexOf('nextWeekProjectName') > -1) {
          const projectName = key.replace('nextWeekProjectName', '');
          nextWeekProject[projectName] = {content: values[key]}
        } else if (key && key.indexOf('thisWeekProjectName') > -1) {
          const projectName = key.replace('thisWeekProjectName', '');
          thisWeekProject[projectName] = {content: values[key]}
        }
      }
    } );

    this.setState({
      modalVisible: true,
      thisWeekProject,
      nextWeekProject
    }, () => { // 请求收到的周报列表
      action.postInfo({
        week,
        year,
        type: 0, // sendTo rather than copyTo
        to: window.INIT_DATA.userinfo.email,
        URL: 'report/received'
      }).then((doc) => {
        this.setState({
          receivedList: doc.data.list
        })
      })
    })
  };

  handleSubmit = ( evt ) => { // 发送按钮功能
    evt.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll( ( err, values ) => {
      if ( !err ) {
        const report = {};
        const details = [];
        for (const key in values) { // details
          if (key) {
            const detail = {};
            if (key.indexOf('thisWeekProjectName') > -1) {
              detail.type = 0;
              detail.projectName = key.replace('thisWeekProjectName', '');
              detail.projectId = this.projectMap[detail.projectName];
              detail.content = values[key];
              details.push(detail);
            } else if (key.indexOf('nextWeekProjectName') > -1) {
              detail.type = 1;
              detail.projectName = key.replace('nextWeekProjectName', '');
              detail.projectId = this.projectMap[detail.projectName];
              detail.content = values[key];
              details.push(detail);
            }
          }
        }
        // messages
        const messages = [];
        values.sendTo.forEach((sendName) => {
          const newMsg = {};
          newMsg.to = this.userMap[sendName];
          newMsg.from = window.INIT_DATA.userinfo.email;
          newMsg.type = 0;
          messages.push(newMsg);
        })
        if (values.copyTo) {
          values.copyTo.forEach((sendName) => {
            const newMsg = {};
            newMsg.to = this.userMap[sendName];
            newMsg.from = window.INIT_DATA.userinfo.email;
            newMsg.type = 1;
            messages.push(newMsg);
          })
        }
        report.details = details;
        report.messages = messages;
        report.email = window.INIT_DATA.userinfo.email;
        report.userId = window.INIT_DATA.userinfo.id;
        report.status = 1; // 发送
        action.postInfo({
          report,
          URL: 'report/create'
        }).then( () => {
          action.postInfo({
            report,
            URL: 'draft/create'
          }).then(() => {
            this.props.router.push('/sendSuccess')
          }).then(() => {
            message.success( <action.Info>保存成功</action.Info> )
          })
        })
      }
    } );
  };

  onPjDeSelect = (value, time) => {
    let projectDelete;
    switch (time) {
      case 0: // 本周
        projectDelete = this.state.thisWeekProject;
        if ( projectDelete[value] ) {
          delete projectDelete[value]
        }
        this.setState({
          thisWeekProject: projectDelete
        })
        break;
      case 1: // 下周
        projectDelete = this.state.nextWeekProject;
        if ( projectDelete[value] ) {
          delete projectDelete[value]
        }
        this.setState({
          nextWeekProject: projectDelete
        })
        break;
      default:
        console.error('时间信息错误');
    }
  }

  onPjSelect = (value, time) => { // value is projectName
    let projectAdded;
    switch (time) {
      case 0: // 本周
        projectAdded = this.state.thisWeekProject;
        if ( !projectAdded[value] ) {
          projectAdded[value] = {}
        }
        this.setState({
          thisWeekProject: projectAdded
        })
        break;
      case 1: // 下周
        projectAdded = this.state.nextWeekProject;
        if ( !projectAdded[value] ) {
          projectAdded[value] = {}
        }
        this.setState({
          nextWeekProject: projectAdded
        })
        break;
      default:
        console.error('时间信息错误');
    }
  }

  renderModal = () => { // 导入我收到的report, and that is a popup modal
    const columns = [
      {
        title: '发件人',
        dataIndex: 'userName',
        key: 'userName',
        width: 85
      },
      {
        title: '发送时间',
        dataIndex: 'time',
        key: 'time',
        width: 125
      },
      {
        title: '相关项目',
        dataIndex: 'projects',
        key: 'projects',
      },
    ];

    const list = this.state.receivedList;
    const dataSource = list ? Array.from(list).map( (item, index) => {
      item.tableNums = index + 1;
      item.userName = item.userId ? item.userId.userName : '';
      item.key = index + 1;
      item.projects = '';
      const details = item.details;
      if (details) {
        details.forEach((detail) => {
          if (item.projects.indexOf(detail.projectName) === -1) { // Avoid the repeat of projectName.
            item.projects += `${detail.projectName} `
          }
        })
      }
      item.time = `${item.year}年 第${item.week}周`;
      return item;
    }) : [];

    const selectionFunction = (record, selected, selectedRows) => {
      this.thisWeekProject = JSON.parse(JSON.stringify(this.state.thisWeekProject)); // Notice the charactor of reference obj! Use 深拷贝
      this.nextWeekProject = JSON.parse(JSON.stringify(this.state.nextWeekProject));
      selectedRows.forEach( (row, index) => {
        const details = row.details;
        details.forEach((detail) => {
          if (detail.type === 1) { // Next week --> Use detail.type to decide week.
            if (this.nextWeekProject[detail.projectName]) { // 已有记录
              const record = this.nextWeekProject[detail.projectName];
              record.content = record.content ? `${record.content} ${detail.content}` : ` ${detail.content}`;
              this.nextWeekProject[detail.projectName] = record;
            } else { // 没有记录
              this.nextWeekProject[detail.projectName] = {
                content: detail.content
              }
            }
          } else { // this week
            if (this.thisWeekProject[detail.projectName]) { // 已有记录
              const record = this.thisWeekProject[detail.projectName];
              record.content = record.content ? `${record.content} ${detail.content}` : ` ${detail.content}`;
              this.thisWeekProject[detail.projectName] = record;
            } else { // 没有记录
              this.thisWeekProject[detail.projectName] = {
                content: detail.content
              }
            }
          }
        })
      });
    };
    
    const rowSelection = { // 多选按钮导入功能
      onSelect: selectionFunction,
      onSelectAll: selectionFunction,
    };

    const importReportToEditField = () => { // import report projects and content to edit panel
      //const projectsArray = this.state.projectsArray;
      this.setState({
        thisWeekProject: this.thisWeekProject, 
        nextWeekProject: this.nextWeekProject
      })
      const array = [];
      // reset some of the fields
      for (const key in this.thisWeekProject) {
        if (key) {
          array.push(`thisWeekProjectName${key}`)
        }
      }
      for (const key in this.nextWeekProject) {
        if (key) {
          array.push(`nextWeekProjectName${key}`)
        }
      }
      this.props.form.resetFields(array);
      this.handleModelCancel();
    };

    return (
      this.state.modalVisible ? <Modal
        title="我收到的周报"
        visible={this.state.modalVisible}
        footer={
          <Button type="primary" ghost onClick={importReportToEditField}>导入</Button>
        }
        onCancel={this.handleModelCancel}
      >
        <Table columns={columns} dataSource={dataSource} rowSelection={rowSelection}
               size="middle"  pagination={false}/>

      </Modal> : null
    )
  };

  handleModelCancel = () => {
    this.setState({
      modalVisible: false
    })
  };

  deleteTheProject = (e, projectName, time) => { // 项目详情下 删除按键功能函数。另外，发送时，考虑在按键时再收集项目信息，而不是在过程中维护。
    let pjMap, stateKey, index;
    const {projectCurrent, projectNext} = this.state;
    switch (time) {
      case 0: // this week
        pjMap = this.state.thisWeekProject;
        stateKey = 'thisWeekProject'
        index = projectCurrent.findIndex((value, index, arr) => {
          return value === projectName;
        })
        projectCurrent.splice(index, 1)
        break;
      case 1: // next week
        pjMap = this.state.nextWeekProject;
        stateKey = 'nextWeekProject'
        index = projectNext.findIndex((value, index, arr) => {
          return value === projectName;
        })
        projectNext.splice(index, 1)
        break;
      default:
        console.error('时间码错误')
    }
    if (pjMap[projectName]) {
      delete pjMap[projectName]
    }

    const obj = {};
    obj[stateKey] = pjMap;
    obj[projectCurrent] = projectCurrent;
    obj[projectNext] = projectNext;
    this.setState(obj);
  };

  queryUserList = (value) => {
    if (value) {
      action.postInfo({
        URL: 'user/ulist',
        userName: value
      }).then((doc) => {
        doc.data.results.forEach((user) => {
          this.userMap[user.userName] = user.id
        })
        this.setState({
          userList: doc.data.results
        })
      })
    }
  }

  userMap = {} // connect userName and user id
  projectMap = {} // connect projectName ande projectId

  renderEditPanel = () => { // 编辑周报
    // form相关
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };

    // 搜索发件人/抄送人数据源
    const userList = this.state.userList;

    const userDataSource = userList ? userList.map((item) => {
      return <SelectOption key={item.userName} data-search={`${item.userName}${item.email}`}>{item.userName}</SelectOption>;
    }) : [];

    // 项目搜索数据源
    const projectArray = this.state.projectList;
    const projectDataSource = projectArray ? Array.from(projectArray).map((project) => {
      this.projectMap[project.projectName] = project.id
      return <SelectOption key={project.projectName}>{project.projectName}</SelectOption>;
    }) : [];

    const bindFunc = (func, data1, data2) => {
      return (evt) => {
        func(evt, data1, data2);
      };
    };

    return (<Content style={{width: '75%', margin: 'auto'}}>
      <Form
        onSubmit={this.handleSubmit}
      >
        <Row className="row-1 oneBorderInput">
          {/*------------------------------------发送面板----------------------------------*/}
          <Col span={24} key='1'>
            <FormItem
              {...formItemLayout}
              className='withoutRadius'
              label='发送给：'
            >
              {getFieldDecorator('sendTo', {
                initialValue: this.state.sendTo,
                rules: [{ required: true, message: '请输入发送人' }],
              })(
                <Select
                  mode="multiple"
                  placeholder="请输入发送人"
                  optionFilterProp='data-search'
                  onSearch={this.queryUserList} // user onSearch instead of onChange
                  allowClear
                >
                  {userDataSource}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24} key='2'>
            <FormItem
              {...formItemLayout}
              className='withoutRadius'
              label='抄送给：'
            >
              {getFieldDecorator('copyTo', {
                initialValue: this.state.copyTo,
              })(
                <Select
                  mode="multiple"
                  placeholder="请输入抄送人"
                  optionFilterProp='data-search'
                  onSearch={this.queryUserList} // user onSearch instead of onChange
                  allowClear
                >
                  {userDataSource}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row className="row-1 oneBorderInput">
          {/*------------------------------------本周总结----------------------------------*/}
          <h3 style={{margin: '20px 20px 20px 6%', color: '#1992F5'}}>本周总结</h3>
          <Col span={24} key='3'>
            <FormItem 
              {...formItemLayout} 
              label='新增项目'
              className='withoutRadius'>
              {getFieldDecorator('projectCurrent', {
                initialValue: this.state.projectCurrent
              })(
                <Select
                  showSearch // use that prop, then the select can be writen
                  placeholder="请输入项目"
                  mode="multiple"
                  //optionFilterProp="children"
                  //onSearch={this.queryProjects} // user onSearch instead of onChange
                  onSelect={bindFunc(this.onPjSelect, 0)}
                  onDeselect={bindFunc(this.onPjDeSelect, 0)}
                  allowClear
                >
                  {projectDataSource}
                </Select>
              )}
            </FormItem>
          </Col>
          {
            (() => {
              const projectNodes = [];
              const thisWeekProject = this.state.thisWeekProject;
              for (const projectName in thisWeekProject) {
                if (projectName) {
                  projectNodes.push(
                    <Col span={24} className="InputWithSuffix">
                      <FormItem
                        {...formItemLayout}
                        label={projectName}
                      >
                        {getFieldDecorator(`thisWeekProjectName${projectName}`, {
                          initialValue: thisWeekProject[projectName].content
                        })(
                          <Input type="textarea" placeholder="请输入项目总结" autosize={{ minRows: 5, maxRows: 5 }}/>
                        )}
                      </FormItem>
                      <Button onClick={bindFunc(this.deleteTheProject, projectName, 0)}>删除</Button>
                    </Col>
                  )
                }
              }
              return projectNodes;
            })()
          }
        </Row>
        <Row className="row-1 oneBorderInput">
          {/*------------------------------------下周计划----------------------------------*/}
          <h3 style={{margin: '20px 20px 20px 6%', color: '#1992F5'}}>下周计划</h3>
          <Col span={24} key='3'>
            {/*----------------注:这里一定要使用onSearch方法，不能用onChange，否则，回填到input里面的只就会是key而不是value !important-----------------*/}
            <FormItem {...formItemLayout} label='新增项目' className='withoutRadius'>
              {getFieldDecorator('projectNext', {
                initialValue: this.state.projectNext
              })(
                <Select
                  showSearch // use that prop, then the select can be writen
                  placeholder="请输入项目"
                  mode="multiple"
                  //optionFilterProp="children"
                  //onSearch={this.queryProjects} // user onSearch instead of onChange
                  onSelect={bindFunc(this.onPjSelect, 1)}
                  onDeselect={bindFunc(this.onPjDeSelect, 1)}
                  allowClear
                >
                  {projectDataSource}
                </Select>
              )}
            </FormItem>
          </Col>
          {
            (() => {
              const projectNodes = [];
              const nextWeekProject = this.state.nextWeekProject;
              for (const projectName in nextWeekProject) {
                if (projectName) {
                  projectNodes.push(
                    <Col span={24} className="InputWithSuffix" >
                      <FormItem
                        {...formItemLayout}
                        label={projectName}
                      >
                        {getFieldDecorator(`nextWeekProjectName${projectName}`, {
                          initialValue: nextWeekProject[projectName].content
                        })(
                          <Input type="textarea" placeholder="请输入项目总结" autosize={{ minRows: 5, maxRows: 5 }}/>
                        )}
                      </FormItem>
                      <Button onClick={bindFunc(this.deleteTheProject, projectName, 1)}>删除</Button>
                    </Col>
                  )
                }
              }
              return projectNodes;
            })()
          }
        </Row>
        <Row className='bottomButton'>
          <Col span={24} key='6'>
            <Button type='primary' ghost onClick={this.showImportModel}>导入周报</Button>
            <Button type="primary" ghost htmlType='submit'>发送</Button>
            <Button type="primary" ghost onClick={this.saveNewReport}>保存</Button>
          </Col>
        </Row>
      </Form>
    </Content>)
  };

  render() {
    return (
      <Row className='newReport'>
        <Col span={18} offset={3}>
          <Layout>
            { this.renderModal() }
            { this.renderEditPanel() }
          </Layout>
        </Col>
      </Row>
    )
  }
}

export default Form.create()( NewReport );
