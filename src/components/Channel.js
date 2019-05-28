import React, { Component } from 'react';
import './Channel.css';
import { connect } from 'react-redux';
import { Table, Divider, Modal } from 'antd';
import { deleteChannel } from '../actions/app';
const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    stationMap: state.station.stationMap,
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
            pathname: '/editChannel',
            search: `?key=${key}`,
        });
    }

    handleClickAdd() {
        const { history } = this.props;
        history.push({
            pathname: '/editChannel',
        });
    }

    render() {
        const { nowStationKey, stationMap } = this.props;
        let seriesInfo = stationMap[nowStationKey] ? stationMap[nowStationKey].seriesInfo : [];
        return (
            <div className="channel-option">
                <div className="channel-head">
                    <span>频道</span>
                    <span className="add-channel" onClick={this.handleClickAdd.bind(this)}>添加</span>
                </div>
                <div className="main-content">
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
                    </Table>
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { stationMap, nowStationKey, history } = this.props;
        if (!stationMap[nowStationKey]) {
            history.push(`/${window.location.search}`);
        }
    }
}

export default connect(
    mapStateToProps,
    { deleteChannel },
)(Channel);