import React, { Component } from 'react';
import './StationGroup.css';
import { Input } from 'antd';
import { MemberCard, SearchMemberCard, } from '../common/Common';
import { connect } from 'react-redux';
import { searchUser, groupMember, addGroupMember, setMemberRole } from '../../actions/app';
import util from '../../services/Util';

const Search = Input.Search;
const mapStateToProps = state => ({
    searchUserList: state.station.searchUserList,
    userList: state.station.userList,
});

class StationGroup extends Component {
    render() {
        const { searchUser, userList, searchUserList, addGroupMember, setMemberRole } = this.props;
        const groupKey = util.common.getSearchParamValue(window.location.search, 'groupKey')
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
                                groupKey={groupKey}
                                userKey={user.userId}
                                avatar={user.avatar ? user.avatar : ''}
                                mobile={`${user.mobileArea} ${user.mobile}`}
                                name={user.nickName ? user.nickName : ''}
                                role={user.role}
                                setMemberRole={setMemberRole}
                            />
                        ))
                    }
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { groupMember } = this.props;
        groupMember(util.common.getSearchParamValue(window.location.search, 'groupKey'));
    }
}

export default connect(
    mapStateToProps,
    { searchUser, groupMember, addGroupMember, setMemberRole, },
)(StationGroup);