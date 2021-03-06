import React, { Component } from 'react';
import './MySites.css';
import { StationCard } from '../common/Common';
import { connect } from 'react-redux';
import { changeStation, } from '../../actions/app';

const mapStateToProps = state => ({
    stationList: state.station.stationList,
});

class MySites extends Component {
    render() {
        const { history, stationList, changeStation, } = this.props;
        return (
            <div
                className="my-site"
                style={{
                    minHeight: `${window.innerHeight}px`
                }}
            >
                <div className="site-station">
                    {
                        stationList.map((station, index) => (
                            <StationCard
                                key={index}
                                station={station}
                                onClick={() => {
                                    changeStation(station._key);
                                    history.push(`/${station.domain}/home`);
                                  }}
                            />
                        ))
                    }
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    { changeStation },
)(MySites);