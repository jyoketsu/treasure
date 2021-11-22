import React, { useEffect } from "react";
import "./Login.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import util from "../services/Util";
import { getUserInfo } from "../actions/app";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  const token = util.common.getQueryString("token");
  const domain = localStorage.getItem("DOMAIN") || "sgkj";
  let redirect_uri =
    localStorage.getItem("REDIRECT_URI") ||
    util.common.getQueryString("redirect_uri");
  redirect_uri = decodeURIComponent(redirect_uri);

  // 根据token获取用户信息
  useEffect(() => {
    if (token) {
      getUserInfo(token, dispatch);
    }
  }, [token, dispatch]);

  // 登录成功，跳转到首页
  useEffect(() => {
    if (user && user._key && !user.isGuest) {
      history.push(redirect_uri ? redirect_uri : `/${domain}/home`);
      localStorage.removeItem("REDIRECT_URI");
    }
  }, [user, domain, redirect_uri, history]);
  return <div className="login"></div>;
}
