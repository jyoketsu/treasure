import React, { Component } from 'react';
import './Subscribe.css';
import { Route, } from "react-router-dom";
import { Tab } from '../common/Common';
import Search from './Search';
import MySites from './MySites';
import Dynamic from './Dynamic';

class Subscribe extends Component {
    constructor(props) {
        super(props);
        let nowRouteKey = '';
        if (window.location.pathname.indexOf('mySites') !== -1) {
            nowRouteKey = 'mySites';
        } else if (window.location.pathname.indexOf('search') !== -1) {
            nowRouteKey = 'search';
        }
        this.state = { currentRouteKey: nowRouteKey }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(routeKey) {
        const { history } = this.props;
        this.setState({ currentRouteKey: routeKey });
        history.push(`${this.pathName}/${routeKey}`);
    }

    render() {
        const { match, } = this.props;
        const { currentRouteKey } = this.state;
        return (
            <div
                style={{
                    height: `${window.innerHeight - 70}px`,
                }}
                className="app-content subscribe-container"
            >
                <Tab
                    currentKey={currentRouteKey}
                    tabList={[
                        { key: '', name: '订阅中心' },
                        { key: 'mySites', name: '站点中心' },
                        { key: 'search', name: '搜索站点' }
                    ]}
                    handleClick={this.handleClick}
                />
                <Route exact path={`${match.path}`} component={Dynamic}></Route>
                <Route path={`${match.path}/mySites`} component={MySites}></Route>
                <Route path={`${match.path}/search`} component={Search}></Route>
            </div>
        );
    };

    componentDidMount() {
        const { match, } = this.props;
        this.pathName = match.url;
        if (this.pathName[this.pathName.length - 1] === '/') {
            this.pathName = this.pathName.substr(0, this.pathName.length - 1);
        }
    }
}

export default Subscribe;