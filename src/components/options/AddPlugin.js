import React, { Component } from 'react';
import './AddPlugin.css';
import { Button, Divider, } from 'antd';
import { connect } from 'react-redux';
import { getPluginList, subscribePlugin, clearPluginList, } from '../../actions/app';

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    plugList: state.plugin.pluginList,
});

class AddPlugin extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 10;
        this.state = {
            linkedPluginKeys: []
        }
    }

    handleClick(key) {
        this.setState((prevState) => {
            let prevKeys = prevState.linkedPluginKeys;
            const index = prevKeys.indexOf(key)
            if (index === -1) {
                prevKeys.push(key);
            } else {
                prevKeys.splice(index, 1);
            }
            return { linkedPluginKeys: prevKeys }
        })
    }

    render() {
        const { nowStationKey, plugList, subscribePlugin, } = this.props;
        const { linkedPluginKeys } = this.state;
        return (
            <div className="add-plugin">
                <div className="add-plugin-header">
                    <span>插件中心</span>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="add-plugin-button"
                        onClick={subscribePlugin.bind(this, nowStationKey, linkedPluginKeys)}
                    >
                        保存
                    </Button>
                </div>
                <Divider />
                <div>
                    {plugList.map((plugin, index) => (
                        <div className="plugin-item" key={index}>
                            <div className="plugin-logo" style={{
                                backgroundImage: plugin.icon ?
                                    `url(${plugin.icon})`
                                    : 'url(/image/icon/plugin-logo.svg)'
                            }}></div>
                            <div className="plugin-info">
                                <span className="plugin-name">{plugin.pluginName}</span>
                                <span>{`链接地址：${plugin.url}`}</span>
                                <span>{`发行方：${plugin.publishStarName}　引用：${plugin.linkCount} ・ 点击：${plugin.clickCount}`}</span>
                            </div>
                            <div
                                className={`plugin-check-button ${linkedPluginKeys.includes(plugin.pluginAppKey) ? 'active' : ''}`}
                                onClick={this.handleClick.bind(this, plugin.pluginAppKey)}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.props.getPluginList(this.props.nowStationKey, this.curPage, this.perPage);
    }

    componentDidUpdate(prevProps) {
        const { plugList } = this.props;
        if (prevProps.plugList.length === 0 && plugList.length !== 0) {
            let list = [];
            for (let i = 0; i < plugList.length; i++) {
                if (plugList[i].isLinked) {
                    list.push(plugList[i].pluginAppKey);
                }
            }
            this.setState({
                linkedPluginKeys: list
            });
        }
    }

    componentWillUnmount() {
        this.props.clearPluginList();
    }
}

export default connect(
    mapStateToProps,
    { getPluginList, subscribePlugin, clearPluginList, },
)(AddPlugin);