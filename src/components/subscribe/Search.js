import React, { Component } from "react";
import "./Search.css";
import { Button, Pagination, Input } from "antd";
import { StationCard } from "../common/Common";
import { connect } from "react-redux";
import { searchStation, changeStation } from "../../actions/app";

const { Search } = Input;

const mapStateToProps = state => ({
  stationList: state.station.matchedStationList,
  matchedNumber: state.station.matchedNumber
});

class SearchStation extends Component {
  constructor(props) {
    super(props);
    this.curPage = sessionStorage.getItem("searchStationPage")
      ? parseInt(sessionStorage.getItem("searchStationPage"), 10)
      : 1;
    this.perPage = 30;
    this.state = {
      keyWord: sessionStorage.getItem("searchStationKeyword")
        ? sessionStorage.getItem("searchStationKeyword")
        : ""
    };
  }

  onChange = page => {
    this.curPage = page;
    sessionStorage.setItem("searchStationPage", page);
    this.props.searchStation(this.state.keyWord, this.curPage, this.perPage);
  };

  render() {
    const {
      history,
      stationList,
      matchedNumber,
      changeStation,
      searchStation,
      location
    } = this.props;
    const { keyWord } = this.state;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    return (
      <div
        className="search-station"
        style={{
          minHeight: `${window.innerHeight - 70 - 56}px`
        }}
      >
        <div className="search-container">
          <Search
            placeholder="请输入站点名"
            onSearch={value => {
              sessionStorage.setItem("searchStationKeyword", value);
              searchStation(value, 1, this.perPage);
            }}
            style={{ width: 200, marginRight: "15px" }}
            value={keyWord}
            onChange={e => this.setState({ keyWord: e.target.value })}
          />
          <Button
            type="primary"
            className="login-form-button"
            onClick={() => {
              history.push(`/${stationDomain}/editStation`);
            }}
          >
            新建站点
          </Button>
        </div>
        <div className="station-container">
          {stationList.map((station, index) => (
            <StationCard
              key={index}
              station={station}
              onClick={() => {
                changeStation(station._key);
                history.push(`/${station.domain}/home`);
              }}
            />
          ))}
          {stationList.length === 0 ? (
            <div style={{ margin: "auto" }}>暂无结果</div>
          ) : null}
        </div>
        <div className="station-foot">
          <Pagination
            current={this.curPage}
            pageSize={this.perPage}
            total={matchedNumber}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { searchStation, changeStation })(
  SearchStation
);
