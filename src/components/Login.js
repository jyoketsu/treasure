import React, { useEffect } from "react";
import "./Login.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import util from "../services/Util";
import { getUserInfo } from "../actions/app";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);
  const token = util.common.getQueryString("token");
  const domain = localStorage.getItem("DOMAIN") || "sgkj";

  // 根据token获取用户信息
  useEffect(() => {
    if (token) {
      getUserInfo(token, dispatch);
    }
  }, [token, dispatch]);

  // 登录成功，跳转到首页
  useEffect(() => {
    if (user && user._key && !user.isGuest) {
      history.push(`/${domain}/home`);
    }
  }, [user, domain, history]);
  return <div className="login"></div>;
}
