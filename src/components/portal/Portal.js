import React, { Component } from 'react';
import './Portal.css';
import { Route, } from "react-router-dom";
import Catalog from './PortalCatalog';
import Detail from './PortalDetail';
import AddButton from '../AddArticleButton';
import StroyLink from '../story/Link';
import { connect } from 'react-redux';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
    eidtLinkVisible: state.story.eidtLinkVisible,
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
        const { match, location, nowStation, eidtLinkVisible } = this.props;
        const { winHeight } = this.state;
        const pathname = location.pathname;
        return (
            <div className="portal-home" style={{ minHeight: `${winHeight}px` }}>
                <div
                    className="portal-home-body"
                    style={{
                        minHeight: `${winHeight - 233 - 50}px`,
                        backgroundImage: pathname.split('/')[2]
                            ? 'unset'
                            : `url(${nowStation ? nowStation.cover : ''})`,
                    }}
                >
                    <Route path={`${match.path}/catalog/:id`} component={Catalog}></Route>
                    <Route path={`${match.path}/detail/:id`} component={Detail}></Route>
                </div>
                {
                    pathname.indexOf('/catalog/') !== -1 ?
                        <div className="operation-panel">
                            <AddButton />
                        </div> : null
                }

                <PortalFooter name={nowStation ? nowStation.name : ''} />
                {eidtLinkVisible && (pathname.indexOf('/catalog/') !== -1) ? <StroyLink /> : null}
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
                <span>{`Powered by 当归`}</span>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {}
)(Portal);