import React, { Component } from 'react';
import './SubscribeStation.css';
import { Button } from 'antd';

class SubscribeStation extends Component {
    render() {
        const { history } = this.props;
        return (
            <div className="app-content">
                <div
                    className="main-content subscribe-station"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`
                    }}
                >
                    <div className="channel-head">
                        <span>订阅中心</span>
                        <Button
                            type="primary"
                            className="login-form-button"
                            onClick={() => { history.push('create') }}
                        >新建站点</Button>
                    </div>
                </div>
            </div>
        );
    };
}

export default SubscribeStation;