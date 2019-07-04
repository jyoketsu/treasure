import React, { Component } from 'react';
import './StationGroup.css';
import { Input } from 'antd';
import { MemberCard, SearchMemberCard, } from '../common/Common';
import { connect } from 'react-redux';
import { searchUser, groupMember, addGroupMember, setMemberRole, transferStation, } from '../../actions/app';

const Search = Input.Search;
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
    searchUserList: state.station.searchUserList,
    userList: state.station.userList,
    groupKey: state.station.nowStation.intimateGroupKey,
});

class StationGroup extends Component {
    render() {
        const {
            searchUser,
            userList,
            searchUserList,
            addGroupMember,
            setMemberRole,
            groupKey,
            nowStation,
            transferStation,
        } = this.props;
        return (
            <div className="station-group">
                <h2>添加成员</h2>
                <Search
                    placeholder="请搜索要添加的人员"
                    onSearch={value => searchUser(value)}
                    style={{ width: 200 }}
                />
                <div className="member-search-result">
                    {
                        searchUserList.map((user, index) => (
                            <SearchMemberCard
                                key={index}
                                groupKey={groupKey}
                                userKey={user._key}
                                gender={user.gender}
                                avatar={user.profile ? user.profile.avatar : ''}
                                mobile={`${user.mobileArea} ${user.mobile}`}
                                name={user.profile ? user.profile.nickName : ''}
                                addGroupMember={addGroupMember}
                            />
                        ))
                    }
                </div>
                <h2>成员列表</h2>
                <div className="member-search-result">
                    {
                        userList.map((user, index) => (
                            <MemberCard
                                key={index}
                                nowStationKey={nowStation._key}
                                groupKey={groupKey}
                                userKey={user.userId}
                                avatar={user.avatar ? user.avatar : ''}
                                mobile={`${user.mobileArea} ${user.mobile}`}
                                name={user.nickName ? user.nickName : ''}
                                role={user.role}
                                userRole={nowStation.role}
                                setMemberRole={setMemberRole}
                                transferStation={transferStation}
                            />
                        ))
                    }
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { groupMember, groupKey } = this.props;
        groupMember(groupKey);
    }
}

export default connect(
    mapStateToProps,
    { searchUser, groupMember, addGroupMember, setMemberRole, transferStation, },
)(StationGroup);