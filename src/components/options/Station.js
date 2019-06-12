import React, { Component } from 'react';
import './Station.css';
import StationBasicInfo from '../User/StationBasicInfo';
import StationGroup from '../User/StationGroup';
import { Tabs, } from 'antd';

import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class Station extends Component {
    render() {
        const { nowStation } = this.props;
        return (
            <div className="station">
                <h2>站点定义</h2>
                <Tabs defaultActiveKey="basicInfo">
                    <TabPane tab="基本信息" key="basicInfo">
                        {
                            nowStation ?
                                <StationBasicInfo stationInfo={nowStation} /> : null
                        }
                    </TabPane>
                    <TabPane tab="成员" key="group">
                        <StationGroup />
                    </TabPane>
                </Tabs>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(Station);