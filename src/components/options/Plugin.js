import React, { Component } from 'react';
import './Channel.css';
import { connect } from 'react-redux';
import { Table, Divider, Modal, Button, } from 'antd';
import { deleteChannel } from '../../actions/app';
const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
});

class Plugin extends Component {
    showDeleteConfirm(key, name) {
        const { deleteChannel } = this.props;
        confirm({
            title: '删除频道',
            content: `确定要删除【${name}】吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteChannel(key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleEdit(key) {
        const { history } = this.props;
        history.push({
            pathname: '/stationOptions/pluginOptions',
            search: `?key=${key}`,
        });
    }

    handleClickAdd() {
        const { history, } = this.props;
        history.push({
            pathname: '/stationOptions/addPlugin',
        });
    }

    render() {
        const { nowStation } = this.props;
        let seriesInfo = nowStation ? nowStation.seriesInfo : [];
        return (
            <div className="channel-option">
                <div className="channel-head">
                    <span>插件管理</span>
                    <Button
                        type="primary"
                        className="login-form-button"
                        onClick={this.handleClickAdd.bind(this)}
                    >新增插件</Button>
                </div>
                <Table dataSource={seriesInfo} rowKey="_key" pagination={false}>
                    <Column title="插件名" dataIndex="name" />
                    <Column
                        title="操作"
                        render={(text, record) => (
                            <span className="tabel-actions">
                                <span onClick={this.handleEdit.bind(this, record._key)}>设置</span>
                                <Divider type="vertical" />
                                <span onClick={this.showDeleteConfirm.bind(this, record._key, record.name)}>删除</span>
                            </span>
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
    { deleteChannel },
)(Plugin);