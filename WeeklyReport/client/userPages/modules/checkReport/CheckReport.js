import React, { Component } from 'react'
import { Link } from 'react-router'
import action from '../dataFile/action'
import { Button, Table, Row, Col, Layout, AutoComplete, Input, Icon, message } from 'antd'
const { Header, Footer, Sider, Content } = Layout;
import PropTypes from 'prop-types'

class CheckReport extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor( options ) {
    super( options );
    const { location } = this.props;
    const { query } = location;
    const { reportId } = query;

    this.state = {
      reportId: reportId || ''
    }
    
    action.postInfo({
      reportId: this.state.reportId,
      URL: 'report/detail'
    }).then((doc) => {
      this.setState({
        reportDetail: doc.data
      })
    })
  }

  render() {
    const reportObj = this.state.reportDetail;
    
    const reportDetailObj = {};
    let toPersons = '', copyPersons = '';

    if (reportObj) {
      const arraySendTo = reportObj.to;
      arraySendTo.forEach( (personInfo) => {
        if (personInfo.type === 0) {
          toPersons += `${personInfo.userName} `;
        } else {
          copyPersons += `${personInfo.userName} `;
        }
      });
    }

    const goBackFunc = () => {
      window.history.go(-1);
    }

    return (
      <div>
        <Row>
          <Col span={20} offset={2} style={{paddingTop: 20, marginTop: 30}}>
            <Col span={16} offset={4}>
              <Icon type="smile-o" style={{fontSize: 50, float: 'left', marginRight: 15}} />
              <h3>发件人：{reportObj && reportObj.from ? reportObj.from.userName : ''}</h3>
              <div>{`${reportObj ? reportObj.year : '-'}年 第${reportObj ? reportObj.week : '-'}周`}</div>
              <div style={{marginTop: 25, clear: 'left'}}>收件人：{toPersons}</div>
              <div>抄送给：{copyPersons}</div>
            </Col>
            <Col span={16} offset={4} style={{marginTop: 10, height: 'auto', border: '1px #ddd solid', padding: 10}}>
              <div>
                {
                  (() => {
                    if (reportObj) {
                      let domArray = [];
                      const thisWeekReports = [];
                      const nextWeekReports = [];
                      const marginDiv = <div style={{marginTop: 10}}></div>
                      const contentList = reportObj.list;
                      contentList.forEach((item) => {
                        const pj = <h4>{item.projectName}：</h4>
                        const content = <div>周报内容：{item.content}</div>
                        if (item.type === 0) { // This week
                          thisWeekReports.push(pj, content, marginDiv);
                        } else if (item.type === 1) {
                          nextWeekReports.push(pj, content, marginDiv);
                        }
                      })  
                      if (thisWeekReports.length) {
                        thisWeekReports.unshift( <h1 style={{marginBottom: 15, fontWeight: 900, fontSize: 16}}>本周总结：</h1> )
                      }
                      if (nextWeekReports.length) {
                        nextWeekReports.unshift( <h1 style={{marginTop: thisWeekReports.length ? 50 : 0, marginBottom: 15, fontWeight: 900, fontSize: 16}}>下周计划：</h1> )
                      }
                      domArray = thisWeekReports.concat(nextWeekReports);
                      if (!domArray.length) {
                        domArray.push( <div style={{fontWeight: 900, fontSize: 14, width: '100%', textAlign: 'center'}}>暂无内容</div> )
                      }
                      return domArray;
                    }
                  })()
                }
              </div>
            </Col>
            <Col span={16} offset={4} style={{marginTop: 20}}>
              <Button type="primary" ghost size="default" style={{float: 'right'}} onClick={goBackFunc}>返回</Button>
            </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CheckReport;
