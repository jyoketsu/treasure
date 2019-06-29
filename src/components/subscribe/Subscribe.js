import React, { Component } from 'react';
import './Subscribe.css';
import { Route, } from "react-router-dom";
// import { Tab } from '../common/Common';
import Search from './Search';
import MySites from './MySites';

class Subscribe extends Component {
    render() {
        const { match, } = this.props;
        return (
            <div className="app-content">
                <Route exact path={`${match.path}`} component={Search}></Route>
                <Route path={`${match.path}/mySites`} component={MySites}></Route>
            </div>
        );
    };
}

export default Subscribe;