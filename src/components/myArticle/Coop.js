import React, { Component } from 'react';
import './Coop.css';
import { connect } from 'react-redux';
// import { myStationLatestStory, changeStation, } from '../../actions/app';

const mapStateToProps = state => ({
    waiting: state.common.waiting,
});

class Coop extends Component {
    render() {
        return (
            <div
                className="my-article"
                ref='container'
                style={{
                    minHeight: `${window.innerHeight - 70 - 56}px`
                }}
            >
                功能开发中。。。Coop
            </div >
        );
    }
}

export default connect(
    mapStateToProps,
    {},
)(Coop);