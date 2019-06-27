import React, { Component } from 'react';
import './SubscribeStation.css';
import { Button, Pagination, Switch, Divider, } from 'antd';
import ClickOutside from '../common/ClickOutside';
import { connect } from 'react-redux';
import { searchStation, subscribe, } from '../../actions/app';

const mapStateToProps = state => ({
    stationList: state.station.matchedStationList,
    matchedNumber: state.station.matchedNumber,
});

class SubscribeStation extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
    }

    onChange = page => {
        this.curPage = page;
        this.props.searchStation('', this.curPage, this.perPage);
    };

    render() {
        const { history, stationList, matchedNumber, subscribe } = this.props;
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
                            onClick={() => { history.push('editStation') }}
                        >新建站点</Button>
                    </div>
                    <div className="station-container">
                        {
                            stationList.map((station, index) => (
                                <StationCard
                                    key={index}
                                    station={station}
                                    saveSubscribe={subscribe}
                                />
                            ))
                        }
                    </div>
                    <div className="station-foot">
                        {
                            matchedNumber !== 0 ?
                                <Pagination
                                    current={this.curPage}
                                    pageSize={this.perPage}
                                    total={matchedNumber}
                                    onChange={this.onChange}
                                /> :
                                null
                        }
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.props.searchStation('', this.curPage, this.perPage);
    }
}

class StationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            checkedChannels: [],
            allChecked: false,
        }
        this.switchCollapse = this.switchCollapse.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    switchCollapse() {
        this.setState((prevState) => ({
            collapse: !prevState.collapse
        }));
    }

    closeDropdown() {
        this.setState({
            collapse: false
        });
    }

    onChange(key, checked) {
        const { station } = this.props;
        const { seriesInfo } = station;
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
        const { saveSubscribe, station, } = this.props;
        const { checkedChannels } = this.state;
        let list = [];
        for (let i = 0; i < checkedChannels.length; i++) {
            list.push({ type: 'series', value: checkedChannels[i] });
        }
        saveSubscribe(list, station._key)
    }

    render() {
        const { station } = this.props;
        const { collapse, checkedChannels, allChecked } = this.state;
        const { seriesInfo } = station;
        // let roleNmae;
        // switch (station.role) {
        //     case 1: roleNmae = '超管'; break;
        //     case 2: roleNmae = '管理员'; break;
        //     case 3: roleNmae = '编辑'; break;
        //     case 4: roleNmae = '作者'; break;
        //     case 5: roleNmae = '超管'; break;
        //     case 6: roleNmae = '成员'; break;
        //     default: roleNmae = '游客'; break;
        // }
        return (
            <ClickOutside onClickOutside={this.closeDropdown}>
                <div className={`station-card role${station.role ? station.role : ''}`} style={{ zIndex: collapse ? '999' : 'unset' }}>
                    <span className="card-station-role">粉丝</span>
                    <i className="card-menu-icon"></i>
                    <div className="card-station-title">
                        <i className="card-station-logo" style={{ backgroundImage: `url(${station.logo})` }}></i>
                        <div className="card-station-info">
                            <span className="card-station-name">{station.name}</span>
                        </div>
                    </div>
                    <div className="card-station-memo">
                        {station.memo}
                    </div>
                    <i className={`card-arrow ${collapse ? 'card-arrow-up' : ''}`} onClick={this.switchCollapse}></i>
                    <div className="card-dropdown" style={{
                        height: collapse ? `${35 + 10 + seriesInfo.length * 35 + 50}px` : 0,
                    }}>
                        <SubscribeChannel
                            channelKey='all'
                            channelName="全站订阅"
                            onChange={this.onChange}
                            checked={allChecked}
                        />
                        <Divider />
                        {
                            seriesInfo.map((channel, index) => (
                                <SubscribeChannel
                                    key={index}
                                    channelKey={channel._key}
                                    channelName={channel.seriesName}
                                    checked={checkedChannels.indexOf(channel._key) === -1 ? false : true}
                                    onChange={this.onChange}
                                />
                            ))
                        }
                        <div className="card-foot">
                            <Button
                                type="primary"
                                onClick={this.handleSave}
                            >保存</Button>
                        </div>
                    </div>
                </div>
            </ClickOutside>
        );
    }

    componentDidMount() {
        const { station } = this.props;
        const { seriesInfo } = station;
        let checkedChannels = [];
        for (let i = 0; i < seriesInfo.length; i++) {
            if (seriesInfo[i].isCareSeries) {
                checkedChannels.push(seriesInfo[i]._key);
            }
        }
        this.setState({
            checkedChannels: checkedChannels,
            allChecked: checkedChannels.length === seriesInfo.length ? true : false
        });
    }

    componentDidUpdate(prevProps) {
        const { station } = this.props;
        if (prevProps.station._key !== station._key) {
            const { seriesInfo } = station;
            let checkedChannels = [];
            for (let i = 0; i < seriesInfo.length; i++) {
                if (seriesInfo[i].isCareSeries) {
                    checkedChannels.push(seriesInfo[i]._key);
                }
            }
            this.setState({
                checkedChannels: checkedChannels,
                allChecked: checkedChannels.length === seriesInfo.length ? true : false
            });
        }
    }
}

class SubscribeChannel extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(checked) {
        this.props.onChange(this.props.channelKey, checked);
    }

    render() {
        const { channelName, checked } = this.props;
        return (
            <div className="card-channel-subscribe">
                <span>{channelName}</span>
                <Switch onChange={this.onChange} checked={checked} />
            </div>
        );
    }
}



export default connect(
    mapStateToProps,
    { searchStation, subscribe, },
)(SubscribeStation);