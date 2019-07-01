import React, { Component } from 'react';
import './Dynamic.css';
import { connect } from 'react-redux';
import { myStationLatestStory, } from '../../actions/app';

const mapStateToProps = state => ({
    stationList: state.story.dynamicStoryList,
});

class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.getAutoResponsiveProps = this.getAutoResponsiveProps.bind(this);
        this.state = {
        };
        this.columns = new Array(3);
        this.kernel = 10;
    }

    getAutoResponsiveProps() {
        return {
            itemMargin: 10,
            containerWidth: this.state.containerWidth || document.body.clientWidth,
            itemClassName: 'item',
            gridWidth: 100,
            transitionDuration: '.5'
        };
    }

    render() {
        const { stationList, history, } = this.props;
        this.columns = new Array(3);
        let itemStyleList = [];

        for (let i = 0; i < stationList.length; i++) {
            const station = stationList[i];
            const index = i;
            const height = 35 + station.albumInfo.length * 70;

            const gridColumn = (index + 1) % 3 === 0 ? 3 : (index + 1) % 3;
            const gridStart = this.columns[gridColumn - 1] === undefined ? 1 : this.columns[gridColumn - 1] + 1;
            const gridEnd = gridStart + Math.ceil(height / this.kernel) - 1;
            const gridRow = `${gridStart} / ${gridEnd}`;
            this.columns[gridColumn - 1] = gridEnd;
            let itemStyle = {
                gridRow: gridRow,
                gridColumn: gridColumn,
            };
            itemStyleList.push(itemStyle);
        }

        return (
            <div
                className="subscribe-dynamic"
                style={{
                    // minHeight: `${window.innerHeight - 70 - 56}px`
                    height: Math.max(...this.columns) * 10
                }}
            >
                {
                    stationList.map((station, index) => {
                        const height = 35 + station.albumInfo.length * 70;

                        const gridColumn = (index + 1) % 3 === 0 ? 3 : (index + 1) % 3;
                        const gridStart = this.columns[gridColumn - 1] === undefined ? 1 : this.columns[gridColumn - 1] + 1;
                        const gridEnd = gridStart + Math.ceil(height / this.kernel) - 1;
                        const gridRow = `${gridStart} / ${gridEnd}`;
                        this.columns[gridColumn - 1] = gridEnd;
                        let itemStyle = {
                            gridRow: gridRow,
                            gridColumn: gridColumn,
                        };
                        console.log(index + 1, '--------------', itemStyle);
                        return (
                            <StationDynamic
                                className="item"
                                key={index}
                                station={station}
                                history={history}
                                style={itemStyleList[index]} />
                        )
                    })
                }
            </div>
        );
    }

    componentDidMount() {
        const { myStationLatestStory } = this.props;
        myStationLatestStory(1);
        window.addEventListener('resize', () => {
            this.setState({
                containerWidth: this.refs.container.clientWidth
            });
        }, false);
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
                </div>
                <div className="station-dynamic-story-list">
                    {
                        station.albumInfo.map((story, index) => (
                            <div className="station-dynamic-story"
                                onClick={
                                    () => history.push(`/${station.domain}/${story.type === 9 ? 'article' : 'story'}?key=${story._key}`)
                                }
                                key={index}>
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