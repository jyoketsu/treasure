import React, { Component } from 'react';
import './Dynamic.css';
import { connect } from 'react-redux';
import { myStationLatestStory, } from '../../actions/app';
import Waterfall from '../common/Waterfall';
import { StoryLoading } from '../story/StoryCard';
import util from '../../services/Util';
import moment from 'moment';

const mapStateToProps = state => ({
    stationList: state.story.dynamicStoryList,
    waiting: state.common.waiting,
});

class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.curPage = sessionStorage.getItem('dynamic-curpage') ?
            parseInt(sessionStorage.getItem('dynamic-curpage'), 10) : 1;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.state = {
            columnNum: 4
        }
        this.setColumn = this.setColumn.bind(this);
    }

    // 滚动查看更多故事
    handleMouseWheel(e) {
        const { waiting, myStationLatestStory, } = this.props;
        let top = document.body.scrollTop || document.documentElement.scrollTop;
        if (
            !waiting &&
            (top + document.body.clientHeight === document.body.scrollHeight)
        ) {
            this.curPage++;
            myStationLatestStory(this.curPage);
        }
    }

    render() {
        const { stationList, history, waiting } = this.props;
        const isMobile = util.common.isMobile();
        const children = stationList.map((station, index) => {
            return (
                <StationDynamic
                    key={index}
                    station={station}
                    history={history}
                    height={35 + station.albumInfo.length * 70}
                />
            )
        });
        return (
            <div
                className="subscribe-dynamic"
                ref='container'
                style={{
                    minHeight: `${window.innerHeight - 70 - 56}px`
                }}
            >
                {
                    isMobile ? children :
                        <Waterfall
                            columnNum={this.state.columnNum}
                            kernel={10}
                        >{children}</Waterfall>
                }
                {
                    waiting ? <StoryLoading /> : <div className="more-dynamic">滑动鼠标，加载更多内容。</div>
                }
            </div>
        );
    }

    setColumn() {
        const containerWidth = this.refs.container.clientWidth;
        this.setState({
            columnNum: Math.floor(containerWidth / 350)
        });
    }

    componentDidMount() {
        const { stationList, myStationLatestStory } = this.props;
        if (stationList.length === 0) {
            this.curPage = 1;
            sessionStorage.setItem('dynamic-curpage', this.curPage);
            myStationLatestStory(this.curPage);
        }

        // 监听滚动，查看更多
        document.body.addEventListener('wheel', this.handleMouseWheel);

        window.addEventListener('resize', () => {
            this.setColumn();
        }, false);
        this.setColumn();
    }

    componentWillUnmount() {
        // 移除滚动事件
        document.body.removeEventListener('wheel', this.handleMouseWheel);
        sessionStorage.setItem('dynamic-curpage', this.curPage);
        window.removeEventListener('resize', this.setColumn);
    }
}

class StationDynamic extends Component {
    render() {
        const { station, style, history, } = this.props;

        return (
            <div
                className="station-dynamic"
                style={style}
            >
                <div className="station-dynamic-header">
                    <span>{station.name}</span>
                    <span>{moment(station.albumInfo[0].updateTime).startOf('hour').fromNow()}</span>
                </div>
                <div className="station-dynamic-story-list">
                    {
                        station.albumInfo.map((story, index) => (
                            <div
                                key={index}
                                className="station-dynamic-story"
                                onClick={
                                    () => history.push(`/${station.domain}/${story.type === 9 ? 'article' : 'story'}?key=${story._key}`)
                                }

                            >
                                <span>{story.title}</span>
                                <i style={{ backgroundImage: `url(${story.cover}?imageView2/1/w/100/h/100)` }}></i>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    { myStationLatestStory, },
)(Dynamic);