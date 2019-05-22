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

    componentDidMount() {
        document.title = '时光宝库';
    }
}

export default HomeSubscribe;