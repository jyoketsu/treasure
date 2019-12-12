import React, { useEffect } from "react";
import "./Header.css";
import moment from "moment";
// import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../actions/app";

function Header() {
  // const history = useHistory();
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);

  useEffect(() => {
    console.log("Header-----useEffect");
    function test() {
      // logout(dispatch);
    }
    setTimeout(() => {
      test();
    }, 2000);
  }, [nowStation, dispatch]);

  let weekofDay;
  switch (moment().day()) {
    case 0:
      weekofDay = "星期日";
      break;
    case 1:
      weekofDay = "星期一";
      break;
    case 2:
      weekofDay = "星期二";
      break;
    case 3:
      weekofDay = "星期三";
      break;
    case 4:
      weekofDay = "星期四";
      break;
    case 5:
      weekofDay = "星期五";
      break;
    case 6:
      weekofDay = "星期六";
      break;
    default:
      break;
  }
  return (
    <div className="village-header">
      <div className="village-name">{nowStation ? nowStation.name : ""}</div>
      <div className="village-time">
        <span>{moment().format("MM月DD日")}</span>
        <span>{weekofDay}</span>
      </div>
      <div className="village-weather">
        <span>天气</span>
        <span>空气质量</span>
      </div>
    </div>
  );
}

export default Header;
