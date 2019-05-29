import React, { Component } from 'react';
import './Common.css';
import { Select } from 'antd';
const { Option } = Select;

class MemberCard extends Component {
    render() {
        const { avatar, name, role, } = this.props;
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
                    <span className="member-name">{name}</span>
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                </div>
            </div>
        );
    };
}

class SearchMemberCard extends Component {
    render() {
        const { avatar, name, mobile } = this.props;
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
                    <span className="member-name">{name}</span>
                    <span className="member-name">{mobile}</span>
                    <span className="member-button">添加</span>
                </div>
            </div>
        );
    };
}


export {
    MemberCard,
    SearchMemberCard
};