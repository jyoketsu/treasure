import React, { Component } from 'react';
import './SubscribeStation.css';
import { Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { searchStation, } from '../../actions/app';

const mapStateToProps = state => ({
    stationList: state.station.matchedStationList,
});

class SubscribeStation extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
    }

    render() {
        const { history, stationList, } = this.props;
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
                                <StationCard key={index} station={station} />
                            ))
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
        }
        this.switchCollapse = this.switchCollapse.bind(this);
    }

    switchCollapse() {
        this.setState((prevState) => ({
            collapse: !prevState.collapse
        }));
    }

    render() {
        const { station } = this.props;
        const { collapse } = this.state;
        return (
            <div className="station-card">
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
                    height: collapse ? '100px' : 0,
                    // border: collapse ? '1px solid gainsboro' : 'none'
                }}>
                    {/* <Divider /> */}
                    <div>全部订阅</div>
                    <div>全部订阅</div>
                    <div className="card-foot">
                        <Button type="primary">保存</Button>
                    </div>
                </div>
            </div>
        );
    }
}



export default connect(
    mapStateToProps,
    { searchStation },
)(SubscribeStation);