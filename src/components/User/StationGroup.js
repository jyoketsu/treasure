import React, { Component } from 'react';
import './StationGroup.css';
import { MemberCard } from '../common/Common';

class StationGroup extends Component {
    render() {
        return (
            <div className="station-group">
                <MemberCard />
            </div>
        );
    };
}

export default StationGroup;