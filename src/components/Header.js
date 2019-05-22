import React, { Component } from 'react';
import './Header.css';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getUserInfo } from '../actions/app';

const mapStateToProps = state => ({
    user: state.auth.user,
    overdue: state.auth.overdue,
    nowStationKey: state.station.nowStationKey,
    stationMap: state.station.stationMap,
});

class Header extends Component {
    render() {
        const { location, nowStationKey, stationMap } = this.props;
        let pathname = location.pathname;
        const starInfo = stationMap[nowStationKey] ? stationMap[nowStationKey].starInfo : null;
        return (
            <ul className="app-menu">
                <li className={`menu-logo`} style={{
                    backgroundImage: `url(${starInfo && starInfo.logo !== null ? starInfo.logo : '/image/background/logo.png'})`
                }}>
                    {/* <Link to="/"></Link> */}
                </li>
                <li className="menu-space"></li>
                <li className={pathname === '/' ? 'active' : ''}>
                    <Link to="/">订阅</Link>
                </li>
                <li className={pathname === '/explore' ? 'active' : ''}>
                    <Link to="/explore">探索</Link>
                </li>
                <li className={pathname === '/editStation' ? 'active' : ''}>
                    <Link to="/editStation">+</Link>
                </li>
                <li className={pathname === '/message' ? 'active' : ''}>
                    <Link to="/message">消息</Link>
                </li>
                <li className={pathname === '/me' ? 'active' : ''}>
                    <Link to="/me">我</Link>
                </li>
            </ul>
        );
    };

    componentDidMount() {
        const { history, getUserInfo } = this.props;
        const SEARCH_STR = window.location.search;
        let token = null;
        let query_token = null;
        if (SEARCH_STR) {
            const QUERY_PARAMS = new URLSearchParams(SEARCH_STR);
            query_token = QUERY_PARAMS.get('token');
        }
        token = query_token ? query_token : window.localStorage.getItem('TOKEN');
        if (token) {
            getUserInfo(token, history);
        } else {
            history.push('/login');
        }
    }

    componentDidUpdate(prevProps) {
        const { overdue, history } = this.props;
        if (!prevProps.overdue && overdue) {
            history.push('/login');
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getUserInfo }
)(Header));