import React, { Component } from 'react';
import './Home.css';
import { connect } from 'react-redux';
import { getStationList, } from '../actions/app';

const mapStateToProps = state => ({
    stationList: state.home.stationList,
});

class Home extends Component {
    render() {
        // const { bannerHeight } = this.state;
        const { stationList } = this.props;
        return (
            <div className="homepage">
                <div className="station-list">
                    <div className={`station-item`}>全部</div>
                    {
                        stationList.map((station, index) => (
                            <div key={index} className={`station-item`}>{station.starName}</div>
                        ))
                    }
                    <div className={`station-item`}>查看所有</div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { getStationList } = this.props;
        getStationList();
    }
}

export default connect(
    mapStateToProps,
    { getStationList, },
)(Home);