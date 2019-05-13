import React, { Component } from 'react';
import './Header.css';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getUserInfo } from '../actions/app';

const mapStateToProps = state => ({
    user: state.auth.user,
    overdue: state.auth.overdue,
});

class Header extends Component {
    render() {
        const { location } = this.props;
        let pathname = location.pathname;
        return (
            <ul className="app-menu">
                <li className={`menu-logo`}>
                    {/* <Link to="/"></Link> */}
                </li>
                <li className="menu-space"></li>
                <li className={pathname === '/' ? 'active' : ''}>
                    <Link to="/">订阅</Link>
                </li>
                <li className={pathname === '/explore' ? 'active' : ''}>
                    <Link to="/explore">探索</Link>
                </li>
                <li className={pathname === '/create' ? 'active' : ''}>
                    <Link to="/create">+</Link>
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