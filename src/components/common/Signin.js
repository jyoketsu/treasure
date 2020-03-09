import React, { useState } from "react";
import "./Signin.css";
import util from "../../services/Util";
import { Modal, message } from "antd";
import { signIn, clearSignin } from "../../actions/app";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

export default function Signin({ style }) {
  const dispatch = useDispatch();
  const [modalSign, setmodalSign] = useState(
    util.common.getQueryString("signin") ? true : false
  );
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);
  const siginResult = useSelector(state => state.auth.siginResult);

  let color = "";
  let text;
  if (siginResult) {
    switch (siginResult.resultCode) {
      case 1:
        color = "green";
        text = "核准用户";
        break;
      case 2:
        color = "yellow";
        text = "审核中";
        break;
      case 3:
        color = "red";
        text = "未核准用户";
        break;
      case 4:
        color = "black";
        text = "非注册用户";
        break;
      default:
        break;
    }
  }
  return (
    <div className="sign-in-wrapper" style={style}>
      <i
        className="sign-in-button"
        onClick={() => {
          if (user.isGuest) {
            localStorage.setItem(
              "REDIRECT_URI",
              `${window.location.pathname}${window.location.search}`
            );
            const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
            const logo = nowStation.logo;
            window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
            return message.info("请先登录！");
          }
          signIn(nowStation._key, dispatch);
        }}
      ></i>
      <Modal
        title="签到结果"
        visible={siginResult}
        footer={null}
        onCancel={() => clearSignin(dispatch)}
      >
        <div className="sign-in-result">
          <i className={`sigin-shield ${color}`}></i>
          <span className="sign-in-result-text">{text}</span>
          <span>{`签到时间：${
            siginResult && siginResult.checkInTime
              ? moment(siginResult.checkInTime).format("YYYY-MM-DD HH:mm:ss")
              : ""
          }`}</span>
        </div>
      </Modal>
      <Modal
        title={`签到-${nowStation.name}`}
        visible={modalSign}
        footer={null}
        onCancel={() => setmodalSign(false)}
      >
        <div className="modal-sign-in">
          <i
            className="sign-in-button-modal"
            onClick={() => {
              if (user.isGuest) {
                localStorage.setItem(
                  "REDIRECT_URI",
                  `${window.location.pathname}${window.location.search}`
                );
                const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
                const logo = nowStation.logo;
                window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
                return message.info("请先登录！");
              }
              signIn(nowStation._key, dispatch);
              setmodalSign(false);
            }}
          ></i>
        </div>
      </Modal>
    </div>
  );
}
