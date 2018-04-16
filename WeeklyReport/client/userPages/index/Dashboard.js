import React, {Component} from 'react'
import {PropTypes} from 'prop-types'

import { Content } from 'antd';

import './Dashboard.less'
class Dashboard extends Component {
  static propTypes = {

  };
  constructor(options) {
    super(options);
    this.state = {}
  }
  render() {
    return (
      <div className='centerTag'>
        <div>Dashboard</div>
      </div>
    )
  }
}
export default Dashboard
