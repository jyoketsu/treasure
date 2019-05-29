import React, { Component } from 'react';
import './Audit.css';
import { withRouter } from "react-router-dom";
import StoryList from '../story/StoryList';
import { connect } from 'react-redux';
import { getStoryList, clearStoryList } from '../../actions/app';
import util from '../../services/Util';

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
});

class Audit extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
    }
    render() {
        return (
            <div className="audit">
                <div className="my-station-head">作品审核</div>
                <div className="main-content">
                    <StoryList audit={true} />
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { getStoryList, sortType, sortOrder, location } = this.props;
        let stationKey = util.common.getSearchParamValue(location.search, 'key');
        getStoryList(7, stationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getStoryList, clearStoryList },
)(Audit));