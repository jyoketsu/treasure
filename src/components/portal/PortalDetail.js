import React, { Component } from 'react';
import './PortalDetail.css';
import { connect } from 'react-redux';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class PortalDetail extends Component {
    render(){
        return (
            <div className="portal-detail">
                门户详情
            </div>
        );
    }

}

export default connect(
    mapStateToProps,
    {}
)(PortalDetail);
