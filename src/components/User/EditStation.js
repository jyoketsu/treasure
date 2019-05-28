import React, { Component } from 'react';
import './EditStation.css';
import util from '../../services/Util';
import StationBasicInfo from './StationBasicInfo';
import StationGroup from './StationGroup';
import { Tabs, } from 'antd';

import { connect } from 'react-redux';

import { editStation, createStation } from '../../actions/app';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
    loading: state.common.loading,
});

class EditStation extends Component {
    constructor(props) {
        super(props);
        const { location, stationList } = props;
        let stationKey = location ? util.common.getSearchParamValue(location.search, 'key') : null;
        this.stationInfo = null;
        for (let i = 0; i < stationList.length; i++) {
            if (stationList[i].starKey === stationKey) {
                this.stationInfo = stationList[i];
                break;
            }
        }
    }

    render() {
        return (
            <div className="edit-station">
                <div className="my-station-head">{this.stationInfo ? '编辑' : '创建'}微站</div>
                <div className="main-content">
                    {
                        this.stationInfo ? (
                            <Tabs defaultActiveKey="basicInfo">
                                <TabPane tab="基本信息" key="basicInfo">
                                    <StationBasicInfo stationInfo={this.stationInfo} />
                                </TabPane>
                                <TabPane tab="成员" key="group">
                                    <StationGroup />
                                </TabPane>
                            </Tabs>
                        ) : <StationBasicInfo stationInfo={this.stationInfo} />
                    }
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    { editStation, createStation },
)(EditStation);