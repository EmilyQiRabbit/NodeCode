import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Row, Col, Icon, message } from 'antd'
import action from '../dataFile/action'

class SendSuccess extends Component {

  showMessg() {
    message.info(<action.Info>发现一枚彩蛋！</action.Info>)
  }

  render() {

    return (
      <div>
        <Row>
          <Col span={24} style={{marginTop: 50, marginBottom: 75, minWidth: 800}}>
            <div className='BumblebeeImg' style={{float: 'right', marginRight: '35%'}}></div>
            <div style={{textAlign: 'right', fontSize: 25, marginTop: 150}}>发送成功，周末愉快～&nbsp;&nbsp;</div>
            <div style={{textAlign: 'right', fontSize: 12, color: 'white', marginLeft: '25%', cursor: 'pointer', width: '10%'}} onClick={this.showMessg}>酒馆</div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SendSuccess;
