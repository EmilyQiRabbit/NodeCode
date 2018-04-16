import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Card, Col, Row, Upload, message, Button, Icon } from 'antd';


export class Dashboard extends Component {

  static propTypes = {
    children: PropTypes.object
  }

  componentDidMount() {
    
  }

  render() {
    if (this.props.children) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }
    return (
      <div className="ant-dashboard-wrap">
        <Row>
          <Col span="8">
            <Card title="Here is 周报后台管理">Welcome \( *^~^* )/</Card>
          </Col>
        </Row>

      </div>
    )
  }

}

function mapStateToProps(state, ownProps) {
  return {
    dashboard: state.get('dashborad')
  };
}


export default Dashboard;
