import React, { Component } from 'react';
import './Profile.css';
import { Form, Input, Button, } from 'antd';
import { connect } from 'react-redux';
import { editAccount } from '../../actions/app';
import UploadAvatar from '../common/UploadAvatar';

const mapStateToProps = state => ({
    user: state.auth.user,
});

const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            nickName: Form.createFormField({
                ...props.nickName,
                value: props.nickName.value,
            }),
            address: Form.createFormField({
                ...props.address,
                value: props.address.value,
            }),
        };
    },
})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="昵称">
                {getFieldDecorator('nickName', {
                    rules: [{ max: 20, message: '不得超过20个字符！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="地址">
                {getFieldDecorator('address', {
                    rules: [{ max: 50, message: '不得超过50个字符！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
});

class Profile extends Component {
    constructor(props) {
        super(props);
        const { user } = props;
        this.state = {
            avatar: user ? user.profile.avatar : '',
            fields: {
                nickName: {
                    value: user && user.profile ? user.profile.nickName : '',
                },
                address: {
                    value: user && user.profile ? user.profile.address : '',
                },
            },
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { fields, avatar } = this.state;
        const { user, editAccount } = this.props;
        editAccount(Object.assign(user.profile && JSON.parse(JSON.stringify(user.profile)) || {}, {
            avatar: avatar,
            nickName: fields.nickName.value,
            address: fields.address.value
        }));
    }

    handleUpload(avatarUrl) {
        this.setState({
            avatar: avatarUrl
        });
    }

    render() {
        const { fields, avatar, } = this.state;
        return (
            <div className="user-profile">
                <UploadAvatar
                    imgUrl={avatar}
                    maxSize={1000000}
                    callback={this.handleUpload}
                />
                <CustomizedForm
                    {...fields}
                    onChange={this.handleFormChange}
                    onSubmit={this.handleSubmit}
                />
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        const { user: prevUser } = prevProps;
        const { user, } = this.props;
        if (prevUser === null && user) {
            this.setState({
                avatar: user ? user.profile.avatar : '',
                fields: {
                    nickName: {
                        value: user && user.profile ? user.profile.nickName : '',
                    },
                    address: {
                        value: user && user.profile ? user.profile.address : '',
                    },
                },
            });
        }
    }
}

export default connect(
    mapStateToProps,
    { editAccount },
)(Form.create({ name: 'profile' })(Profile));