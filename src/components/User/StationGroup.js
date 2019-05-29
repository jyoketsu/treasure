import React, { Component } from 'react';
import './StationGroup.css';
import { MemberCard } from '../common/Common';

class StationGroup extends Component {
    render() {
        return (
            <div className="station-group">
                <MemberCard
                    avatar="http://cdn-icare.qingtime.cn/47F8CB6C.png"
                    name="测试"
                    role={0}
                />
            </div>
        );
    };
}

export default StationGroup;