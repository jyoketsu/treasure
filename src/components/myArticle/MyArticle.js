import React, { Component } from 'react';
import { Route, } from "react-router-dom";
import { Tab } from '../common/Common';
import Article from './Article';
import Coop from './Coop';
import Check from './Check';

class MyArticle extends Component {
    constructor(props) {
        super(props);
        let nowRouteKey = '';
        if (window.location.pathname.indexOf('cooperation') !== -1) {
            nowRouteKey = 'cooperation';
        } else if (window.location.pathname.indexOf('check') !== -1) {
            nowRouteKey = 'check';
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
            <div className="app-content subscribe-container">
                <Tab
                    currentKey={currentRouteKey}
                    tabList={[
                        { key: '', name: '我的文章' },
                        { key: 'cooperation', name: '协作文章' },
                        { key: 'check', name: '待审核' }
                    ]}
                    handleClick={this.handleClick}
                />
                <Route exact path={`${match.path}`} component={Article}></Route>
                <Route path={`${match.path}/cooperation`} component={Coop}></Route>
                <Route path={`${match.path}/check`} component={Check}></Route>
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

export default MyArticle;