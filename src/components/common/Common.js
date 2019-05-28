import React, { Component } from 'react';
import './Common.css';

class MemberCard extends Component {
    render() {
        const { avatar, name, role, } = this.props;
        return (
            <div className="member-card">
                <i class="member-avatar" style={{

                }}></i>
                <div className="member-info"></div>
            </div>
        );
    };
}

export {
    MemberCard,
};