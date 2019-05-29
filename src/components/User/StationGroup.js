import React, { Component } from 'react';
import './StationGroup.css';
import { Input } from 'antd';
import { MemberCard, SearchMemberCard, } from '../common/Common';
import { connect } from 'react-redux';
import { searchUser } from '../../actions/app';
const Search = Input.Search;
const mapStateToProps = state => ({
    userList: state.station.userList,
});

class StationGroup extends Component {
    render() {
        const { searchUser, userList, } = this.props;
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
                        userList.map((user, index) => (
                            <SearchMemberCard
                                key={index}
                                avatar={user.profile ? user.profile.avatar : ''}
                                mobile={`${user.mobileArea} ${user.mobile}`}
                                name={user.profile ? user.profile.nickName : ''}
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
                                avatar={user.profile ? user.profile.avatar : ''}
                                mobile={`${user.mobileArea} ${user.mobile}`}
                                name={user.profile ? user.profile.nickName : ''}
                            />
                        ))
                    }
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    { searchUser },
)(StationGroup);