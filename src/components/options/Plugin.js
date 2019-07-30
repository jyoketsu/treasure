import React, { Component } from 'react';
import './Channel.css';
import { connect } from 'react-redux';
import { Table, Divider, Modal, Button, } from 'antd';
import { cancelPlugin, sortPlugin, } from '../../actions/app';
const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
});

class Plugin extends Component {
    showDeleteConfirm(key, name) {
        const { cancelPlugin } = this.props;
        confirm({
            title: '取消订阅插件',
            content: `确定要取消【${name}】吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                cancelPlugin(key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleEdit(key) {
        const { history, match, } = this.props;
        history.push({
            pathname: `/${match.params.id}/stationOptions/pluginOptions`,
            search: `?key=${key}`,
        });
    }

    handleClickAdd() {
        const { history, match } = this.props;
        history.push({
            pathname: `/${match.params.id}/stationOptions/addPlugin`,
        });
    }

    toPluginSystem() {
        const { history, match } = this.props;
        history.push({
            pathname: `/${match.params.id}/stationOptions/pluginSystem`,
        });
    }

    handleSort(index, isUp) {
        const { nowStation, nowStationKey, sortPlugin } = this.props;
        let pluginInfo = nowStation ? nowStation.pluginInfo : [];
        let keys = [];
        for (let i = 0; i < pluginInfo.length; i++) {
            keys.push(pluginInfo[i]._key);
        }
        sortPlugin(index, isUp, keys, nowStationKey);
    }

    render() {
        const { nowStation } = this.props;
        let pluginInfo = nowStation ? nowStation.pluginInfo : [];
        return (
            <div className="channel-option">
                <div className="channel-head">
                    <span>插件管理</span>
                    <div>
                        {
                            nowStation && nowStation._key === '593122852' ? [
                                <Button
                                    key="systemPlugin"
                                    type="primary"
                                    className="plugin-system-button"
                                    onClick={this.toPluginSystem.bind(this)}
                                >
                                    系统插件管理
                                </Button>,
                                <Divider key="divider" type="vertical" />
                            ] : null
                        }
                        <Button
                            type="primary"
                            className="login-form-button"
                            onClick={this.handleClickAdd.bind(this)}
                        >添加插件</Button>
                    </div>
                </div>
                <Table dataSource={pluginInfo} rowKey="_key" pagination={false}>
                    <Column title="插件名" dataIndex="pluginName" />
                    <Column
                        title="操作"
                        render={(text, record) => (
                            <span className="tabel-actions">
                                <span onClick={this.handleEdit.bind(this, record._key)}>设置</span>
                                <Divider type="vertical" />
                                <span onClick={this.showDeleteConfirm.bind(this, record._key, record.pluginName)}>取消订阅</span>
                            </span>
                        )}
                    />
                    <Column
                        title="排序"
                        render={(text, record, index) => (
                            <div className="table-sort">
                                <i
                                    className={`sort-up ${index === 0 ? 'disabled' : ''}`}
                                    onClick={this.handleSort.bind(this, index, true)}
                                ></i>
                                <i
                                    className={`sort-down ${index === pluginInfo.length - 1 ? 'disabled' : ''}`}
                                    onClick={this.handleSort.bind(this, index, false)}
                                ></i>
                            </div>
                        )}
                    />
                </Table>
            </div>
        );
    };

    componentDidMount() {
        const { nowStation, history } = this.props;
        if (!nowStation) {
            history.push(`/${window.location.search}`);
        }
    }
}

export default connect(
    mapStateToProps,
    { cancelPlugin, sortPlugin, },
)(Plugin);