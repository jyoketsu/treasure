import React, { Component } from 'react';
import './MyStation.css';
import { Table, Divider, Tag, Modal, message } from 'antd';

import { connect } from 'react-redux';

import { getStationList, deleteStation } from '../actions/app';

const { Column } = Table;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
});

class MyStation extends Component {

    showDeleteConfirm(key, name) {
        const { deleteStation } = this.props;
        confirm({
            title: '删除微站',
            content: `确定要删除【${name}】吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStation(key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    toEditStation(key) {
        const { history } = this.props;
        history.push({
            pathname: '/editStation',
            search: `?key=${key}`,
        });
    }

    render() {
        const { stationList } = this.props;
        let data = [];
        for (let i = 0; i < stationList.length; i++) {
            let station = stationList[i];
            if (station.isMyStar) {
                data.push(station);
            }
        }
        return (
            <div className="my-station">
                <div className="my-station-head">我的微站</div>
                <div className="main-content">
                    <Table dataSource={data} rowKey="starKey" pagination={false}>
                        <Column title="微站" dataIndex="starName" />
                        <Column
                            title="频道"
                            dataIndex="seriesInfo"
                            render={series => (
                                <span>
                                    {series.map(serie => (
                                        <Tag color="blue" key={serie._key}>
                                            {serie.name}
                                        </Tag>
                                    ))}
                                </span>
                            )}
                        />
                        <Column
                            title="操作"
                            render={(text, record) => (
                                <span className="tabel-actions">
                                    <span onClick={this.toEditStation.bind(this, record.starKey)}>编辑</span>
                                    <Divider type="vertical" />
                                    <span onClick={this.showDeleteConfirm.bind(this, record.starKey, record.starName)}>删除</span>
                                </span>
                            )}
                        />
                    </Table>
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { getStationList, stationList } = this.props;
        if (stationList.length === 0) {
            getStationList();
        }
    }

    componentDidUpdate(prevProps) {
        const { stationList } = this.props;
        if (stationList.length < prevProps.stationList.length) {
            message.success('删除成功！');
        }

    }
}

export default connect(
    mapStateToProps,
    { getStationList, deleteStation },
)(MyStation);