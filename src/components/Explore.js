import React, { Component } from 'react';
import './Explore.css';

class Explore extends Component {
    render() {
        return (
            <div
                className="app-content explore"
                style={{
                    minHeight: `${window.innerHeight - 70}px`
                }}
            >功能开发中，敬请期待！</div>
        );
    };
}

export default Explore;