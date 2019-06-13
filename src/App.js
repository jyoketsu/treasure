import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Header from './components/Header';
import Home from './components/Home';
import Explore from './components/Explore';
import Message from './components/Message';
import Me from './components/User/Me';
import Create from './components/Create';
import EditStation from './components/User/EditStation';
import Login from './components/Login';
import Story from './components/story/Story';
import EditStory from './components/story/EditStory';
import Contribute from './components/story/Contribute';
import Audit from './components/User/Audit';
import StationOptions from './components/options/StationOptions';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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
          <div className="route-container">
            <Route exact path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/message" component={Message} />
            <Route path="/me" component={Me} />
            <Route path="/create" component={Create} />
            <Route path="/login" component={Login} />
            <Route path="/editStation" component={EditStation} />
            <Route path="/story" component={Story} />
            <Route path="/editStory" component={EditStory}></Route>
            <Route path="/contribute" component={Contribute}></Route>
            <Route path="/audit" component={Audit}></Route>
            <Route path="/stationOptions" component={StationOptions}></Route>
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
