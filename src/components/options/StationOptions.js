import React, { Component } from 'react';
import './StationOptions.css';
import { Link, Route, } from "react-router-dom";
import Station from './Station';
import Channel from './Channel';
import Plugin from './Plugin';
import Content from './Content';
import MemberList from './MemberList';
import { connect } from 'react-redux';
import util from '../../services/Util';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ClickOutside from '../common/ClickOutside';
import EditChannel from './EditChannel';
import AddPlugin from './AddPlugin';
import CreatePlugin from './CreatePlugin';
import PluginOptions from './PluginOptions';
import PluginSystem from './PluginSystem';
import MemberStoryList from './MemberStoryList';
import { clearPluginList } from './../../actions/app';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class StationOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            minHeight: `${window.innerHeight}px`,
        }
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        this.setState({ minHeight: `${window.innerHeight}px`, });
    }

    handleTriggerClick() {
        this.setState((prevState) => ({
            showMenu: !prevState.showMenu
        }));
    }

    render() {
        const { match, location, nowStation, } = this.props;
        const { minHeight } = this.state;
        const search = location.search;
        const pathname = location.pathname.split('/')[3];
        const isMobile = util.common.isMobile();
        return (
            <div
                className="app-content"
                style={{ top: nowStation && nowStation.style === 2 ? '0' : '70px' }}
            >
                <div className="main-content station-options" style={{
                    minHeight: minHeight
                }}>
                    <ReactCSSTransitionGroup transitionName="sideMenu" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        {
                            !isMobile || this.state.showMenu ?
                                <ClickOutside onClickOutside={this.handleTriggerClick}>
                                    <div className="options-menu">
                                        {
                                            nowStation && nowStation.role && nowStation.role <= 2 ? [
                                                <div key="station" className={!pathname ? 'active' : ''}>
                                                    <i style={{ backgroundImage: 'url(/image/icon/stationOptions/station-options.svg)' }}></i>
                                                    <Link
                                                        to={`${match.url}${search}`}
                                                        onClick={this.handleTriggerClick}
                                                    >站点定义</Link>
                                                </div>,
                                                <div key="channel" className={pathname === 'channel' ? 'active' : ''}>
                                                    <i style={{ backgroundImage: 'url(/image/icon/stationOptions/channel-manage.svg)' }}></i>
                                                    <Link
                                                        to={`${match.url}/channel${search}`}
                                                        onClick={this.handleTriggerClick}
                                                    >频道管理</Link>
                                                </div>,
                                                <div key="plugin" className={pathname === 'plugin' ? 'active' : ''}>
                                                    <i style={{ backgroundImage: 'url(/image/icon/stationOptions/plugin-manage.svg)' }}></i>
                                                    <Link
                                                        to={`${match.url}/plugin${search}`}
                                                        onClick={this.handleTriggerClick}
                                                    >插件管理</Link>
                                                </div>
                                            ] : null
                                        }
                                        {
                                            nowStation && nowStation.role && nowStation.role <= 3 ? [
                                                <div className={pathname === 'content' ? 'active' : ''} key="content">
                                                    <i style={{ backgroundImage: 'url(/image/icon/stationOptions/article-manage.svg)' }}></i>
                                                    <Link
                                                        to={`${match.url}/content${search}`}
                                                        onClick={this.handleTriggerClick}
                                                    >内容管理</Link>
                                                </div>,
                                                <div className={pathname === 'memberList' ? 'active' : ''} key="memberlist">
                                                    <i style={{ backgroundImage: 'url(/image/icon/stationOptions/article-manage.svg)' }}></i>
                                                    <Link
                                                        to={`${match.url}/memberList${search}`}
                                                        onClick={this.handleTriggerClick}
                                                    >粉丝列表</Link>
                                                </div>,
                                            ] : null
                                        }

                                    </div>
                                </ClickOutside> :
                                null
                        }
                    </ReactCSSTransitionGroup>
                    <i className="menu-trigger" onClick={this.handleTriggerClick}></i>
                    <div className="options-content">
                        {
                            nowStation && nowStation.role && nowStation.role < 3 ?
                                <Route exact path={`${match.path}`} component={Station}></Route> :
                                <Route exact path={`${match.path}`} component={Content}></Route>
                        }
                        <Route path={`${match.path}/channel`} component={Channel}></Route>
                        <Route path={`${match.path}/plugin`} component={Plugin}></Route>
                        <Route path={`${match.path}/content`} component={Content}></Route>
                        <Route path={`${match.path}/memberList`} component={MemberList}></Route>
                        <Route path={`${match.path}/editChannel`} component={EditChannel}></Route>
                        <Route path={`${match.path}/addPlugin`} component={AddPlugin}></Route>
                        <Route path={`${match.path}/pluginOptions`} component={PluginOptions}></Route>
                        <Route path={`${match.path}/createPlugin`} component={CreatePlugin}></Route>
                        <Route path={`${match.path}/pluginSystem`} component={PluginSystem}></Route>
                        <Route path={`${match.path}/memberStory`} component={MemberStoryList}></Route>
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        const { nowStation, history, match } = this.props;
        if (!nowStation) {
            history.push(`/${match.params.id}`);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.clearPluginList();
    }
}

export default connect(
    mapStateToProps,
    { clearPluginList },
)(StationOptions);