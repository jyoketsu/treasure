import React, { Component } from 'react';
import './CheckArticle.css';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { auditStory, deleteStory, } from '../../actions/app';
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    story: state.story.story,
    groupKey: state.station.nowStation ? state.station.nowStation.intimateGroupKey : null,
});

class CheckArticle extends Component {
    constructor(props) {
        super(props);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }

    showDeleteConfirm() {
        const { deleteStory, story } = this.props;
        confirm({
            title: '删除',
            content: `确定要删除吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStory(story._key);
            },
        });
    }

    render() {
        const { auditStory, story, groupKey, handleClickEdit } = this.props;
        return (
            <div className="check-button-container">
                <Button type="primary" onClick={auditStory.bind(this, story._key, groupKey, 2)}>审核通过</Button>
                <Button onClick={auditStory.bind(this, story._key, groupKey, 3)}>审核不通过</Button>
                {/* <Button onClick={handleClickEdit}>编辑</Button> */}
                <Button type="danger" onClick={this.showDeleteConfirm}>删除</Button>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    { auditStory, deleteStory, },
)(CheckArticle);