import React from "react";
import "./TitleHead.css";

export default function TitleHead({ icon, text }) {
  return (
    <div className="village-title-head">
      <div>
        <i style={{ backgroundImage: `url(${icon})` }}></i>
        <span>{text}</span>
      </div>
      <i></i>
    </div>
  );
}
