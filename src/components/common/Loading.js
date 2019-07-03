import React, { Component } from 'react';
import './Loading.css';
import { Spin } from 'antd';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

let loadingInstance = 0;

let getLoadingInstance = (properties) => {
    loadingInstance = loadingInstance || Loading.newInstance(properties);
    return loadingInstance;
}

export default class Loading extends Component {
    static open(properties) {
        getLoadingInstance(properties);
    }

    static close() {
        if (loadingInstance) {
            loadingInstance.destroy();
            loadingInstance = null;
        }
    }

    render() {
        let text = this.props.text || '请稍候...';
        return (
            <div className="loading-box">
                <div className="loading-dialog">
                    <Spin size="large" />
                    <span className="loading-content">{text}</span>
                </div>
            </div>
        );
    }
}

Loading.propTypes = {
    text: PropTypes.string,
}

Loading.newInstance = function newLoadingInstance(properties) {
    let props = properties || {};
    let div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(React.createElement(Loading, props), div);
    return {
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        },
    }
}