import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Spin } from "antd";
import { connect } from "react-redux";
import Init from "./components/Init";
import Home from "./components/Home";
import Message from "./components/Message";
import Me from "./components/User/Me";
import EditStation from "./components/User/EditStation";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Story from "./components/story/Story";
// import EditStory from './components/story/EditStory';
import Contribute from "./components/story/Contribute";
import StationOptions from "./components/options/StationOptions";
import EditArticle from "./components/story/EditArticle";
import Article from "./components/story/Article";
import Subscribe from "./components/subscribe/Subscribe";
import MyArticle from "./components/myArticle/MyArticle";
import StoryEdit from "./components/story/StoryEdit";
import NotFound from "./components/NotFound";
import PortalHome from "./components/formats/portal/Portal";
import Village from "./components/formats/village/Village";
import { HOST_NAME } from "./global";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const mapStateToProps = state => ({
  loading: state.common.loading,
  nowStation: state.station.nowStation
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minHeight: `${window.innerHeight}px`
    };
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState({ minHeight: `${window.innerHeight}px` });
  }

  render() {
    const { loading, nowStation } = this.props;
    const { minHeight } = this.state;
    // 站点类型
    const stationType = nowStation ? nowStation.style : "";
    // 主页
    let home;
    switch (stationType) {
      // 普通站
      case 1:
        home = <Route path="/:id/home" component={Home} />;
        break;
      // 门户站
      case 2:
        home = <Route path="/:id/home" component={PortalHome} />;
        break;
      case 3:
        home = <Route path="/:id/home" component={Village} />;
        break;
      default:
        home = <Route path="/:id/home" component={Home} />;
        break;
    }

    return (
      <Router>
        <div className="app" style={{ minHeight: minHeight }}>
          <Init />
          <div className="route-container">
            {home}
            <Route path="/:id/message" component={Message} />
            <Route path="/:id/me" component={Me} />
            <Route path="/:id/editStation" component={EditStation} />
            <Route path="/:id/story" component={Story} />
            {/* <Route path="/:id/editStory" component={EditStory}></Route> */}
            <Route path="/:id/editStory" component={StoryEdit}></Route>
            <Route path="/:id/contribute" component={Contribute}></Route>
            <Route
              path="/:id/stationOptions"
              component={StationOptions}
            ></Route>
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

  componentWillMount() {
    var url = window.location.href;
    // 自动切换为https
    if (url.indexOf(HOST_NAME) !== -1 && url.indexOf("https") < 0) {
      url = url.replace("http:", "https:");
      window.location.replace(url);
    }

    if (
      window.location.pathname !== "/" &&
      !window.location.pathname.split("/")[2]
    ) {
      window.location.href = `${window.location.href}/home`;
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
}

export default connect(mapStateToProps, {})(App);
