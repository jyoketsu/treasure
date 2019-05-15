import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Header from './components/Header';
import Home from './components/Home';
import Explore from './components/Explore';
import Message from './components/Message';
import Me from './components/Me';
import Create from './components/Create';
import MyStation from './components/MyStation';
import EditStation from './components/EditStation';
import Login from './components/Login';
import Story from './components/story/Story'

const mapStateToProps = state => ({
  loading: state.common.loading,
})

class App extends Component {
  render() {
    const { loading } = this.props;
    return (
      <Router>
        <div className="app">
          <Header />
          <div className="app-content">
            <Route exact path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/message" component={Message} />
            <Route path="/me" component={Me} />
            <Route path="/create" component={Create} />
            <Route path="/myStation" component={MyStation} />
            <Route path="/login" component={Login} />
            <Route path="/editStation" component={EditStation} />
            <Route path="/story" component={Story} />
          </div>
          {loading ? (
            <div className="loading-mask">
              <Spin size="large" />
            </div>
          ) : null}
        </div>
      </Router>
    );
  }
}

export default connect(
  mapStateToProps,
  {},
)(App);
