import React from "react";
import "./TitleHead.css";

export default function TitleHead({ icon, text, onClick, style }) {
  return (
    <div
      className="village-title-head"
      style={style}
      onClick={
        onClick
          ? () => {
              onClick();
            }
          : () => {}
      }
    >
      <div>
        <i style={{ backgroundImage: `url(${icon})` }}></i>
        <span>{text}</span>
      </div>
      <i></i>
    </div>
  );
}
