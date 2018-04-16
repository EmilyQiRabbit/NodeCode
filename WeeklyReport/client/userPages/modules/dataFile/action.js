import { message } from 'antd'
import callApi from '../../../utils/callApi';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const postInfo = (formData) => { // 查询
  if (formData.URL) {
    const queryUrl = formData.URL;
    delete formData.URL;
    return callApi.post(queryUrl, formData)
  }
  console.error('Check the URL!');
};


class Info extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };
  render() {
    return <span>{this.props.children}</span>
  }
}

export default {
  postInfo,
  Info
}


