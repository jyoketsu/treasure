import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { Spin } from 'antd';
import { connect } from 'react-redux';
import Header from './components/Header';
import Home from './components/Home';
import Message from './components/Message';
import Me from './components/User/Me';
import EditStation from './components/User/EditStation';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Story from './components/story/Story';
// import EditStory from './components/story/EditStory';
import Contribute from './components/story/Contribute';
import StationOptions from './components/options/StationOptions';
import EditArticle from './components/story/EditArticle';
import Article from './components/story/Article';
import Subscribe from './components/subscribe/Subscribe';
import MyArticle from './components/myArticle/MyArticle';
import StoryEdit from './components/story/StoryEdit';
import NotFound from './components/NotFound';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const mapStateToProps = state => ({
  loading: state.common.loading,
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minHeight: `${window.innerHeight - 70}px`,
    }
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState({ minHeight: `${window.innerHeight - 70}px`, });
  }

  render() {
    const { loading } = this.props;
    const { minHeight } = this.state;
    return (
      <Router>
        <div className="app" style={{
          minHeight: minHeight
        }}>
          <Header />
          <div className="route-container">
            <Route exact path="/:id" component={Home} />
            <Route path="/:id/message" component={Message} />
            <Route path="/:id/me" component={Me} />
            <Route path="/:id/editStation" component={EditStation} />
            <Route path="/:id/story" component={Story} />
            {/* <Route path="/:id/editStory" component={EditStory}></Route> */}
            <Route path="/:id/editStory" component={StoryEdit}></Route>
            <Route path="/:id/contribute" component={Contribute}></Route>
            <Route path="/:id/stationOptions" component={StationOptions}></Route>
            <Route path="/:id/article" component={Article}></Route>
            <Route path="/:id/editArticle" component={EditArticle} />
            <Route path="/account/login" component={Login} />
            <Route path="/account/register" component={Register} />
            <Route path="/account/reset" component={ResetPassword} />
            <Route path="/:id/subscribe" component={Subscribe} />
            <Route path="/:id/myArticle" component={MyArticle} />
            <Route path="/station/notFound" component={NotFound} />
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

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}

export default connect(
  mapStateToProps,
  {},
)(App);
