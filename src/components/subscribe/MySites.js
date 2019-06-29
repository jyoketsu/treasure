import React, { Component } from 'react';
import './MySites.css';

class MySites extends Component {
    render() {
        return (
            <div
                className="main-content my-site"
                style={{
                    minHeight: `${window.innerHeight - 70}px`
                }}
            >
                我的站点</div>
        );
    };
}

export default MySites;