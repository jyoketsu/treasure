import React, { Component } from "react";
import "./MemberList.css";
import { MemberCard } from "../common/Common";
import { connect } from "react-redux";
import { groupMember, clearStoryList } from "../../actions/app";

const mapStateToProps = state => ({
  nowStation: state.station.nowStation,
  userList: state.station.userList,
  groupKey: state.station.nowStation
    ? state.station.nowStation.fansGroupKey
    : null
});

class MemberList extends Component {
  render() {
    const {
      userList,
      groupKey,
      nowStation,
      history,
      clearStoryList
    } = this.props;
    return (
      <div className="member-list">
        {userList.map((user, index) => (
          <MemberCard
            key={index}
            nowStationKey={nowStation._key}
            groupKey={groupKey}
            userKey={user.userId}
            avatar={user.avatar ? user.avatar : ""}
            mobile={`${user.mobileArea} ${user.mobile}`}
            name={user.nickName ? user.nickName : ""}
            role={user.role}
            userRole={nowStation.role}
            count={user.albumCount}
            disabled={true}
            handleClick={() => {
              clearStoryList();
              history.push(`memberStory?key=${user.userId}`);
            }}
          />
        ))}
      </div>
    );
  }

  componentDidMount() {
    const { nowStation, groupMember, groupKey, clearStoryList } = this.props;
    groupMember(groupKey, (nowStation && nowStation._key) || "");
    clearStoryList();
  }
}

export default connect(mapStateToProps, { groupMember, clearStoryList })(
  MemberList
);
