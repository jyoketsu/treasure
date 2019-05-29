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
        let search = location.search;
        const starInfo = stationMap[nowStationKey] ? stationMap[nowStationKey].starInfo : null;
        return (
            <ul className="app-menu" ref={elem => this.nv = elem}>
                <li className={`menu-logo`} style={{
                    backgroundImage: `url(${starInfo && starInfo.logo !== null ? starInfo.logo : '/image/background/logo.png'})`
                }}>
                    {/* <Link to="/"></Link> */}
                </li>
                <li className="menu-space"></li>
                <li className={pathname === '/' ? 'active' : ''}>
                    <Link to={`/${search}`}>订阅</Link>
                </li>
                {!search ?
                    <li className={pathname === '/explore' ? 'active' : ''}>
                        <Link to={`/explore${search}`}>探索</Link>
                    </li> : null
                }
                {!search ?
                    <li className={pathname === '/editStation' ? 'active' : ''}>
                        <Link to="/editStation">+</Link>
                    </li> : null
                }
                <li className={pathname === '/message' ? 'active' : ''}>
                    <Link to={`/message${search}`}>消息</Link>
                </li>
                <li className={pathname === '/me' ? 'active' : ''}>
                    <Link to={`/me${search}`}>我</Link>
                </li>
            </ul>
        );
    };

    componentDidMount() {
        this.nv.addEventListener('touchmove', function (e) {
            e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
        }, { passive: false }); //passive 参数不能省略，用来兼容ios和android

        const { history, getUserInfo, location } = this.props;
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
            history.push(`/login${location.search}`);
        }
    }

    componentDidUpdate(prevProps) {
        const { overdue, history, location } = this.props;
        if (!prevProps.overdue && overdue) {
            history.push(`/login${location.search}`);
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getUserInfo }
)(Header));