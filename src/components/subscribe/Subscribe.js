import React, { Component } from 'react';
import './Subscribe.css';
import { Route, } from "react-router-dom";
import { Tab } from '../common/Common';
import Search from './Search';
import MySites from './MySites';

class Subscribe extends Component {
    constructor(props) {
        super(props);
        this.state = { currentRouteKey: '' }
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
            <div className="app-content subscribe-container">
                <Tab
                    currentKey={currentRouteKey}
                    tabList={[
                        { key: '', name: '站点中心' },
                        { key: 'search', name: '搜索站点' }
                    ]}
                    handleClick={this.handleClick}
                />
                <Route exact path={`${match.path}`} component={MySites}></Route>
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