import api from "../services/Api";
import { message } from "antd";

import {
  LOGIN,
  REGISTER,
  GET_USER_INFO,
  LOGOUT,
  BIND_MOBILE,
  EDIT_ACCOUNT,
  SIGN_IN,
  CLEAR_SIGN_IN
} from "../actions/app";
const defaultState = {
  user: null,
  siginResult: null
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    // 登陆
    case LOGIN:
      if (!action.error) {
        return {
          ...state,
          user: action.payload
        };
      } else {
        return state;
      }
    // 登出
    case LOGOUT:
      return {
        ...state,
        user: {
          _key: "593335993",
          right: 0,
          status: 1,
          profile: { nickName: "游客" },
          isGuest: true
        }
      };
    case REGISTER:
      if (!action.error) {
        return {
          ...state,
          user: action.payload.data
        };
      } else {
        return state;
      }
    case BIND_MOBILE:
      if (!action.error) {
        return {
          ...state,
          user: action.payload
        };
      } else {
        return state;
      }
    // 获取用户信息
    case GET_USER_INFO:
      if (!action.error) {
        const res = action.payload;
        return {
          ...state,
          user: res.result
        };
      } else {
        window.sessionStorage.clear();
        window.localStorage.clear();
        api.setToken("");
        return {
          ...state,
          user: null
        };
      }
    case EDIT_ACCOUNT:
      if (!action.error) {
        message.success("编辑成功！");
        let user = JSON.parse(JSON.stringify(state.user));
        user.profile = action.profile;
        return {
          ...state,
          user: user
        };
      } else {
        return state;
      }
    case SIGN_IN:
      if (!action.error) {
        return {
          ...state,
          siginResult: action.payload.result
        };
      } else {
        return state;
      }
    case CLEAR_SIGN_IN: {
      return {
        ...state,
        siginResult: null
      };
    }
    default:
      return state;
  }
};

export default auth;
