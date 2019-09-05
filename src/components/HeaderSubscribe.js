import React, { Component } from 'react';
import './HeaderSubscribe.css';
import { withRouter } from "react-router-dom";
import ClickOutside from './common/ClickOutside';
import { Button, Checkbox, } from 'antd';
import { connect } from 'react-redux';
import {
    subscribe,
    subscribeStation,
} from '../actions/app';

const mapStateToProps3 = state => ({
    user: state.auth.user,
    nowStation: state.station.nowStation,
});

class Subscribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedChannels: [],
            allChecked: false,
        }
        this.onChange = this.onChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    onChange(e) {
        const { nowStation } = this.props;
        const { seriesInfo } = nowStation;
        const key = e.target.name;
        const checked = e.target.checked;
        if (key === 'all') {
            let checkedChannels = [];
            if (checked) {
                for (let i = 0; i < seriesInfo.length; i++) {
                    checkedChannels.push(seriesInfo[i]._key);
                }
            }
            this.setState({
                checkedChannels: checkedChannels,
                allChecked: checked,
            });
        } else {
            this.setState((prevState) => {
                let prevList = prevState.checkedChannels;
                if (checked) {
                    prevList.push(key);
                } else {
                    prevList.splice(prevList.indexOf(key), 1);
                }
                return {
                    checkedChannels: prevList,
                    allChecked: prevList.length === seriesInfo.length ? true : false
                }
            });
        }
    }

    handleSave() {
        const { subscribe, subscribeStation, nowStation, switchSubscribe, } = this.props;
        const { checkedChannels, allChecked } = this.state;
        switchSubscribe();
        let list = [];
        for (let i = 0; i < checkedChannels.length; i++) {
            list.push({ type: 'series', value: checkedChannels[i] });
        }
        if (allChecked) {
            subscribeStation(nowStation._key, allChecked);
        } else {
            subscribe(list, nowStation._key, checkedChannels);
        }
    }

    render() {
        const { nowStation, switchSubscribe } = this.props;
        const channelList = nowStation ? nowStation.seriesInfo : [];
        const { checkedChannels, allChecked } = this.state;
        return (
            <div className="subscribe-menu">
                <ClickOutside onClickOutside={switchSubscribe}>
                    <div className="menu-title">
                        <span>订阅</span>
                        <Button
                            type="primary"
                            className="save-subscribe"
                            onClick={this.handleSave}
                        >保存</Button>
                    </div>
                    <div className="subscribe-menu-item">
                        <span>全站</span>
                        <Checkbox name="all" checked={allChecked} onChange={this.onChange} />
                    </div>
                    <div className="menu-title">
                        <span>频道</span>
                        {/* <span className="select-all">全选</span> */}
                    </div>
                    {channelList.map((channel, index) => (
                        <div className="subscribe-menu-item" key={index}>
                            <span>{channel.name}</span>
                            <Checkbox
                                name={channel._key}
                                checked={checkedChannels.indexOf(channel._key) === -1 ? false : true}
                                onChange={this.onChange}
                            />
                        </div>
                    ))}
                </ClickOutside>
            </div>
        );
    }

    componentDidMount() {
        const { nowStation } = this.props;
        const channelList = nowStation ? nowStation.seriesInfo : [];
        let checkedChannels = [];
        for (let i = 0; i < channelList.length; i++) {
            if (channelList[i].isCareSeries) {
                checkedChannels.push(channelList[i]._key);
            }
        }
        this.setState({
            checkedChannels: checkedChannels,
            allChecked: checkedChannels.length === channelList.length ? true : false
        });
    }
}

export default withRouter(connect(
    mapStateToProps3,
    { subscribe, subscribeStation, }
)(Subscribe))