import React, { Component } from 'react';
import './HomeSubscribe.css';
import StoryList from './story/StoryList';
import util from '../services/Util';

class HomeSubscribe extends Component {
    render() {
        return (
            <div className="home-subscribe">
                <div className="main-content">
                    <StoryList />
                </div>
            </div>
        );
    };

    componentWillMount() {
        let tarStationName = util.common.getSearchParamValue(window.location.search, 'station');
        if (tarStationName) {
            document.title = tarStationName;
        } else {
            document.title = '当归';
        }
    }
}

export default HomeSubscribe;