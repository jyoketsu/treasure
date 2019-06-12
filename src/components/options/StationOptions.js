import React, { Component } from 'react';
import './StationOptions.css';
import { Link, Route, } from "react-router-dom";
import Station from './Station';
import Channel from './Channel';

class StationOptions extends Component {
    render() {
        const { match, location, } = this.props;
        let search = location.search;
        return (
            <div className="app-content">
                <div className="main-content station-options">
                    <div className="options-menu">
                        <div><Link to={`${match.url}${search}`}>站点定义</Link></div>
                        <div><Link to={`${match.url}/channel${search}`}>频道管理</Link></div>
                        <div>插件管理</div>
                        <div>内容管理</div>
                    </div>
                    <div className="options-content">
                        <Route exact path={`${match.path}`} component={Station}></Route>
                        <Route path={`${match.path}/channel`} component={Channel}></Route>
                    </div>

                </div>
            </div>
        );
    };
}

export default StationOptions;