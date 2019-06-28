import React, { Component } from 'react';
import './SubscribeStation.css';
import { Button, Pagination, Input, } from 'antd';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { searchStation, changeStation, } from '../../actions/app';

const { Search } = Input;

const mapStateToProps = state => ({
    stationList: state.station.matchedStationList,
    matchedNumber: state.station.matchedNumber,
});

class SubscribeStation extends Component {
    constructor(props) {
        super(props);
        this.curPage = sessionStorage.getItem('searchStationPage') ?
            parseInt(sessionStorage.getItem('searchStationPage')) : 1;
        this.perPage = 30;
        this.state = {
            keyWord: sessionStorage.getItem('searchStationKeyword') ?
                sessionStorage.getItem('searchStationKeyword') : ''
        }
    }

    onChange = page => {
        this.curPage = page;
        sessionStorage.setItem('searchStationPage', page);
        this.props.searchStation(this.state.keyWord, this.curPage, this.perPage);
    };

    render() {
        const { history, stationList, matchedNumber, changeStation, searchStation, } = this.props;
        const { keyWord } = this.state;
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
                        <div>
                            <Search
                                placeholder="请输入站点名"
                                onSearch={
                                    value => {
                                        sessionStorage.setItem('searchStationKeyword', value);
                                        searchStation(value, 1, this.perPage)
                                    }
                                }
                                style={{ width: 200, marginRight: '15px' }}
                                value={keyWord}
                                onChange={e => this.setState({ keyWord: e.target.value })}
                            />
                            <Button
                                type="primary"
                                className="login-form-button"
                                onClick={() => { history.push('editStation') }}
                            >新建站点</Button>
                        </div>
                    </div>
                    <div className="station-container">
                        {
                            stationList.map((station, index) => (
                                <StationCard
                                    key={index}
                                    station={station}
                                    history={history}
                                    changeStation={changeStation}
                                />
                            ))
                        }
                        {stationList.length === 0 ?
                            <div style={{ margin: 'auto' }}>暂无结果</div> :
                            null}
                    </div>
                    <div className="station-foot">
                        <Pagination
                            current={this.curPage}
                            pageSize={this.perPage}
                            total={matchedNumber}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        // this.props.searchStation('', this.curPage, this.perPage);
    }
}

class StationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logoSize: null,
        }
    }

    handleClick(key, domain) {
        const { history, changeStation } = this.props;
        changeStation(key);
        history.push(`/${domain}`);
    }

    render() {
        const { station, } = this.props;
        const { logoSize } = this.state;
        let roleNmae;
        switch (station.role) {
            case 1: roleNmae = '超管'; break;
            case 2: roleNmae = '管理员'; break;
            case 3: roleNmae = '编辑'; break;
            case 4: roleNmae = '作者'; break;
            case 5: roleNmae = '超管'; break;
            case 6: roleNmae = '成员'; break;
            default: roleNmae = '游客'; break;
        }
        return (
            <div
                className={`station-card role${station.role ? station.role : ''}`}
                onClick={this.handleClick.bind(this, station._key, station.domain)}
            >
                <span className="card-station-role">{roleNmae}</span>
                <div className="card-station-title">
                    <i
                        className="card-station-logo"
                        style={{
                            backgroundImage: `url(${station.logo ? station.logo : '/image/background/logo.svg'})`,
                            width: logoSize ? `${Math.ceil(68 * (logoSize.width / logoSize.height))}px` : '68px'
                        }}
                    ></i>
                    <span className="card-station-name">{station.name}</span>
                </div>
            </div>
        );
    }



    async componentDidMount() {
        const { station } = this.props;
        const { seriesInfo } = station;
        let checkedChannels = [];
        for (let i = 0; i < seriesInfo.length; i++) {
            if (seriesInfo[i].isCareSeries) {
                checkedChannels.push(seriesInfo[i]._key);
            }
        }
        // 获取logo大小
        let size = await util.common.getImageInfo(station.logo);
        this.setState({
            checkedChannels: checkedChannels,
            allChecked: checkedChannels.length === seriesInfo.length ? true : false,
            logoSize: size
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

export default connect(
    mapStateToProps,
    { searchStation, changeStation, },
)(SubscribeStation);