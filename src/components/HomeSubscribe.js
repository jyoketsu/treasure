import React, { Component } from 'react';
import './HomeSubscribe.css';
import StoryList from './story/StoryList';

class HomeSubscribe extends Component {
    render() {
        return (
            <div className="home-subscribe">
                <div className="main-content">
                    <StoryList />
                </div>
            </div>
        );
    };
}

export default HomeSubscribe;