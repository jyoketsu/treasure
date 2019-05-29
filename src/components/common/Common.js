import React, { Component } from 'react';
import './Common.css';
import { Select } from 'antd';
const { Option } = Select;

class MemberCard extends Component {
    render() {
        const { avatar, name, role, } = this.props;
        return (
            <div className="member-card">
                <i class="member-avatar" style={{
                    backgroundImage: `url(${avatar}?imageView2/1/w/80/h/80)`
                }}></i>
                <div className="member-info">
                    <span>{name}</span>
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

export {
    MemberCard,
};