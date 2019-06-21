import React, { Component } from 'react';
import './EditStation.css';
import util from '../../services/Util';
import StationBasicInfo from './StationBasicInfo';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    stationList: state.station.stationList,
});

class EditStation extends Component {
    constructor(props) {
        super(props);
        const { location, stationList } = props;
        let stationKey = location ? util.common.getSearchParamValue(location.search, 'key') : null;
        this.stationInfo = null;
        for (let i = 0; i < stationList.length; i++) {
            if (stationList[i]._key === stationKey) {
                this.stationInfo = stationList[i];
                break;
            }
        }
    }

    render() {
        return (
            <div className="app-content">
                <div className="main-content edit-station">
                    <div className="channel-head">
                        <span>创建站点</span>
                    </div>
                    <StationBasicInfo stationInfo={this.stationInfo} />
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(EditStation);