import React, { Component } from 'react';
import './Channel.css';
import { connect } from 'react-redux';
import { Table, Divider, Modal, Button, } from 'antd';
import { deleteChannel, sortChannel, } from '../../actions/app';
const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
});

class Channel extends Component {
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
            pathname: 'editChannel',
            search: `?key=${key}`,
        });
    }

    handleClickAdd() {
        const { history, } = this.props;
        history.push({
            pathname: 'editChannel',
        });
    }

    handleSort(index, isUp) {
        const { nowStation, nowStationKey, sortChannel } = this.props;
        let seriesInfo = nowStation ? nowStation.seriesInfo : [];
        let keys = [];
        for (let i = 0; i < seriesInfo.length; i++) {
            keys.push(seriesInfo[i]._key);
        }
        sortChannel(index, isUp, keys, nowStationKey);
    }

    render() {
        const { nowStation } = this.props;
        let seriesInfo = nowStation ? nowStation.seriesInfo : [];
        return (
            <div className="channel-option">
                <div className="channel-head">
                    <span>频道管理</span>
                    <Button
                        type="primary"
                        className="login-form-button"
                        onClick={this.handleClickAdd.bind(this)}
                    >新增频道</Button>
                </div>
                <Table dataSource={seriesInfo} rowKey="_key" pagination={false}>
                    <Column title="频道名" dataIndex="name" />
                    <Column
                        title="操作"
                        render={(text, record) => (
                            <span className="tabel-actions">
                                <span onClick={this.handleEdit.bind(this, record._key)}>编辑</span>
                                <Divider type="vertical" />
                                <span onClick={this.showDeleteConfirm.bind(this, record._key, record.name)}>删除</span>
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
                                    className={`sort-down ${index === seriesInfo.length - 1 ? 'disabled' : ''}`}
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
    { deleteChannel, sortChannel, },
)(Channel);