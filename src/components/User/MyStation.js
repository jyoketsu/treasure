import React, { Component } from 'react';
import './MyStation.css';
import { Modal, message } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import util from '../../services/Util';
import ClickOutside from '../common/ClickOutside';
import { getStationList, deleteStation } from '../../actions/app';

const confirm = Modal.confirm;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
});

class MyStation extends Component {

    showDeleteConfirm(key, name) {
        const { deleteStation } = this.props;
        confirm({
            title: '删除微站',
            content: `确定要删除【${name}】吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStation(key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    toEditStation(key, groupKey, route) {
        const { history } = this.props;
        const stationKey = util.common.getSearchParamValue(window.location.search, 'stationKey');
        sessionStorage.setItem('me-tab', 'myStation');
        history.push({
            pathname: `/${route}`,
            search: stationKey ? `?stationKey=${stationKey}&key=${key}&groupKey=${groupKey}` : `?key=${key}&groupKey=${groupKey}`,
        });
    }

    render() {
        const { stationList } = this.props;
        let data = [];
        for (let i = 0; i < stationList.length; i++) {
            let station = stationList[i];
            if (station.isMyStar) {
                data.push(station);
            }
        }
        return (
            <div className="my-station">
                {
                    data.map((station, index) => (
                        <StationCard
                            key={index}
                            cover={station.cover}
                            starName={station.starName}
                            memo={station.memo}
                            editStation={this.toEditStation.bind(this, station.starKey, station.intimateGroupKey, 'editStation')}
                            audit={this.toEditStation.bind(this, station.starKey, station.intimateGroupKey, 'audit')}
                            deleteStation={this.showDeleteConfirm.bind(this, station.starKey, station.starName)}
                        />))
                }
            </div>
        );
    };

    componentDidMount() {
        const { getStationList, stationList } = this.props;
        if (stationList.length === 0) {
            getStationList();
        }
    }

    componentDidUpdate(prevProps) {
        const { stationList } = this.props;
        if (stationList.length < prevProps.stationList.length) {
            message.success('删除成功！');
        }

    }
}

class StationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDrop: false,
        }
        this.switchDrop = this.switchDrop.bind(this);
    }

    switchDrop() {
        this.setState((prevState) => ({
            showDrop: !prevState.showDrop
        }));
    }

    render() {
        const { cover, starName, memo, deleteStation, editStation, audit } = this.props;
        const { showDrop } = this.state;
        return (
            <div className="station-card">
                <div className="station-card-cover" style={{ backgroundImage: ` url("${cover}?imageView2/2/h/230/")` }}>
                    <div className="station-option" onClick={this.switchDrop}></div>
                    {
                        showDrop ?
                            <ClickOutside onClickOutside={this.switchDrop}>
                                <div className="station-option-dorpdown">
                                    <div onClick={editStation}>编辑</div>
                                    <div onClick={audit}>审核</div>
                                    <div onClick={deleteStation}>删除</div>
                                </div>
                            </ClickOutside>
                            : null
                    }

                </div>
                <div className="station-card-title">{starName}</div>
                <div className="station-card-info">
                    {memo}
                </div>
            </div>
        );
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getStationList, deleteStation },
)(MyStation));