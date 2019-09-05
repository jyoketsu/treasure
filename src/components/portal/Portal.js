import React, { Component } from 'react';
import './Portal.css';
import { Link, Route, } from "react-router-dom";
import Catalog from './PortalCatalog';
import { connect } from 'react-redux';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class Portal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            winHeight: window.innerHeight
        }
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        this.setState({ winHeight: window.innerHeight });
    }

    render() {
        const { match, nowStation } = this.props;
        const { winHeight } = this.state;
        console.log('${match.path}/catalog', `${match.path} / catalog`);
        return (
            <div className="portal-home" style={{ minHeight: `${winHeight}px` }}>
                <div
                    className="portal-home-body"
                    style={{
                        minHeight: `${winHeight - 233 - 50}px`,
                        backgroundImage: `url(${nowStation ? nowStation.cover : ''})`,
                    }}
                >
                    <Route path={`${match.path}/catalog`} component={Catalog}></Route>
                </div>
                <PortalFooter name={nowStation ? nowStation.name : ''} />
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
}

class PortalFooter extends Component {
    render() {
        const { name } = this.props;
        return (
            <div className="portal-foot">
                <span>
                    <span>版权所有</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>2019-2029</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>All Rights Reserved</span>
                </span>
                <span>{`Powered by 时光宝库`}</span>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {}
)(Portal);