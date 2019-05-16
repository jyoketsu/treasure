import React, { Component } from 'react';
import './Story.css';
import { connect } from 'react-redux';
import EditStory from './EditStory';

const mapStateToProps = state => ({
});

class Story extends Component {
    render() {
        return (
            <div
                className="story-container"
            >
                <EditStory/>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {},
)(Story);