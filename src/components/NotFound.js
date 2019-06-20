import React, { Component } from 'react';
// import './Explore.css';

class NotFound extends Component {
    render() {
        return (
            <div className="app-content not-found" style={{
                fontSize: '300px',
                textAlign: 'center',
                height: `${window.innerHeight - 70}px`
            }}>404</div>
        );
    };
}

export default NotFound;