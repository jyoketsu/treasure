import React, { Component } from 'react';
import './Channel.css';
import { connect } from 'react-redux';
import { Table, Divider, Button, Modal, } from 'antd';
import { getPluginList, clearPluginList, deletePlugin, } from '../../actions/app';
const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    plugList: state.plugin.pluginList,
});

class PluginSystem extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
    }

    showDeleteConfirm(key, name) {
        const { deletePlugin } = this.props;
        confirm({
            title: '删除插件',
            content: `确定要删除【${name}】吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deletePlugin(key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleClickCreate() {
        const { history, match } = this.props;
        history.push({
            pathname: `/${match.params.id}/stationOptions/createPlugin`,
        });
    }

    handleEdit(key) {
        const { history, match } = this.props;
        history.push({
            pathname: `/${match.params.id}/stationOptions/createPlugin`,
            search: `?key=${key}`,
        });
    }

    render() {
        const { plugList } = this.props;
        return (
            <div className="channel-option">
                <div className="channel-head">
                    <span>系统插件管理</span>
                    <div>
                        <Button
                            type="primary"
                            className="login-form-button"
                            onClick={this.handleClickCreate.bind(this)}
                        >创建插件</Button>
                    </div>
                </div>
                <Table dataSource={plugList} rowKey="pluginAppKey" pagination={false}>
                    <Column title="插件名" dataIndex="pluginName" />
                    <Column
                        title="操作"
                        render={(text, record) => (
                            <span className="tabel-actions">
                                <span onClick={this.handleEdit.bind(this, record.pluginAppKey)}>编辑</span>
                                <Divider type="vertical" />
                                <span onClick={this.showDeleteConfirm.bind(this, record.pluginAppKey, record.pluginName)}>删除</span>
                            </span>
                        )}
                    />
                </Table>
            </div>
        );
    };

    componentDidMount() {
        const { plugList, getPluginList } = this.props;
        if (plugList.length === 0) {
            getPluginList(this.props.nowStationKey, this.curPage, this.perPage);
        }
    }
}

export default connect(
    mapStateToProps,
    { getPluginList, clearPluginList, deletePlugin, },
)(PluginSystem);