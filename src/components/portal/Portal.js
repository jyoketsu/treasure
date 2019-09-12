import React, { Component } from 'react';
import './Portal.css';
import { message } from 'antd';
import { Route, } from "react-router-dom";
import Catalog from './PortalCatalog';
import Detail from './PortalDetail';
import AddButton from '../AddArticleButton';
import { connect } from 'react-redux';
const mapStateToProps = state => ({
    user: state.auth.user,
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
        const { match, location, nowStation, user, } = this.props;
        const { pluginInfo = [] } = nowStation;
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
                    <div className="portal-plugin">
                        <Plugins
                            plugins={pluginInfo}
                            content={nowStation}
                            user={user}
                            style={{
                                display: 'flex'
                            }}
                        />
                    </div>
                    <Route path={`${match.path}/catalog/:id`} component={Catalog}></Route>
                    <Route path={`${match.path}/detail/:id`} component={Detail}></Route>
                </div>
                <div className="operation-panel">
                    <AddButton />
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

class Plugins extends Component {
    render() {
        const { plugins, content, user, style } = this.props;
        const token = localStorage.getItem('TOKEN');
        return (
            <div className="portal-plugin" style={style}>
                {
                    // plugins.map((plugin, index) => (
                    //     <div
                    //         key={index}
                    //         className="station-plugin"
                    //         onClick={
                    //             () => {
                    //                 switch (plugin.publish) {
                    //                     case 1: window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                    //                         break;
                    //                     case 2: content.role > 2 ?
                    //                         message.info('没有权限访问！') :
                    //                         window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                    //                         break;
                    //                     case 3:
                    //                         if (content.role || plugin.isSeePlugin) {
                    //                             window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                    //                         } else {
                    //                             if (user.isGuest) {
                    //                                 message.info('请登录');
                    //                                 return;
                    //                             } else {
                    //                                 this.rightAnswer = plugin.answer;
                    //                                 this.question = {
                    //                                     type: 'plugin',
                    //                                     param: {
                    //                                         url: `${plugin.url}/${content.domain}?token=${token}`,
                    //                                         key: plugin._key,
                    //                                     },
                    //                                 }
                    //                                 this.switchPluginVisible(plugin.question, '');
                    //                             }
                    //                         }
                    //                         break;
                    //                     default: break;
                    //                 }
                    //             }
                    //         }
                    //     >
                    //         <i style={{ backgroundImage: `url(${plugin.icon})` }}></i>
                    //         <span>{plugin.name}</span>
                    //     </div>
                    // ))
                }
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {}
)(Portal);