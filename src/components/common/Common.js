import React, { Component } from 'react';
import './Common.css';
import { Select } from 'antd';
const { Option } = Select;

class MemberCard extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const { userKey, groupKey, setMemberRole, } = this.props;
        setMemberRole(groupKey, userKey, value);
    }
    render() {
        const { avatar, name, role, mobile, } = this.props;
        return (
            <div className="member-card">
                <div className="member-avatar-container">
                    <i className="member-avatar" style={{
                        backgroundImage: `url(${avatar ?
                            `${avatar}?imageView2/1/w/80/h/80` :
                            '/image/icon/avatar.svg'})`
                    }}></i>
                </div>
                <div className="member-info">
                    <span className="member-name">{name || ''}</span>
                    <span className="member-name">{mobile || ''}</span>
                    <Select defaultValue={role} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value={1}>超管</Option>
                        <Option value={2}>管理员</Option>
                        <Option value={3}>编辑</Option>
                        <Option value={4}>作者</Option>
                        <Option value={5}>成员</Option>
                    </Select>
                </div>
            </div>
        );
    };
}

class SearchMemberCard extends Component {
    render() {
        const { groupKey, userKey, gender, avatar, name, mobile, addGroupMember } = this.props;
        return (
            <div className="member-card">
                <div className="member-avatar-container">
                    <i className="member-avatar" style={{
                        backgroundImage: `url(${avatar ?
                            `${avatar}?imageView2/1/w/80/h/80` :
                            '/image/icon/avatar.svg'})`
                    }}></i>
                </div>
                <div className="member-info">
                    <span className="member-name">{name || ''}</span>
                    <span className="member-name">{mobile || ''}</span>
                    <span className="member-button" onClick={addGroupMember.bind(this, groupKey, [{
                        userKey: userKey,
                        nickName: name,
                        avatar: avatar,
                        gender: gender,
                        role: 5
                    }])}>添加</span>
                </div>
            </div>
        );
    };
}


export {
    MemberCard,
    SearchMemberCard
};