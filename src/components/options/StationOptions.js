import React, { Component } from 'react';
import './StationOptions.css';
import { Link, Route, } from "react-router-dom";
import Station from './Station';
import Channel from './Channel';
import Plugin from './Plugin';
import Content from './Content';
import { connect } from 'react-redux';
import util from '../../services/Util';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ClickOutside from '../common/ClickOutside';
import EditChannel from './EditChannel';
import AddPlugin from './AddPlugin';
import CreatePlugin from './CreatePlugin';
import PluginOptions from './PluginOptions';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class StationOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
        }
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
    }

    handleTriggerClick() {
        this.setState((prevState) => ({
            showMenu: !prevState.showMenu
        }));
    }

    render() {
        const { match, location, } = this.props;
        const search = location.search;
        const pathname = location.pathname.split('/')[2];
        const isMobile = util.common.isMobile();
        return (
            <div className="app-content">
                <div className="main-content station-options" style={{
                    minHeight: `${window.innerHeight}px`
                }}>
                    <ReactCSSTransitionGroup transitionName="sideMenu" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        {
                            !isMobile || this.state.showMenu ?
                                <ClickOutside onClickOutside={this.handleTriggerClick}>
                                    <div className="options-menu">
                                        <div className={!pathname ? 'active' : ''}>
                                            <Link to={`${match.url}${search}`}>站点定义</Link>
                                        </div>
                                        <div className={pathname === 'channel' ? 'active' : ''}>
                                            <Link to={`${match.url}/channel${search}`}>频道管理</Link>
                                        </div>
                                        <div className={pathname === 'plugin' ? 'active' : ''}>
                                            <Link to={`${match.url}/plugin${search}`}>插件管理</Link>
                                        </div>
                                        <div className={pathname === 'content' ? 'active' : ''}>
                                            <Link to={`${match.url}/content${search}`}>内容管理</Link>
                                        </div>
                                    </div>
                                </ClickOutside> :
                                null
                        }
                    </ReactCSSTransitionGroup>
                    <i className="menu-trigger" onClick={this.handleTriggerClick}></i>
                    <div className="options-content">
                        <Route exact path={`${match.path}`} component={Station}></Route>
                        <Route path={`${match.path}/channel`} component={Channel}></Route>
                        <Route path={`${match.path}/plugin`} component={Plugin}></Route>
                        <Route path={`${match.path}/content`} component={Content}></Route>
                        <Route path={`${match.path}/editChannel`} component={EditChannel}></Route>
                        <Route path={`${match.path}/addPlugin`} component={AddPlugin}></Route>
                        <Route path={`${match.path}/pluginOptions`} component={PluginOptions}></Route>
                        <Route path={`${match.path}/createPlugin`} component={CreatePlugin}></Route>
                    </div>
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { nowStation, location, history } = this.props;
        if (!nowStation) {
            history.push(`/${location.search}`)
        }
    }
}

export default connect(
    mapStateToProps,
    {},
)(StationOptions);