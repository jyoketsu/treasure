import React from "react";
import "./ScrollTitle.css";

export default function ScrollTitle({ titleList, nowTitle, onClick }) {
  return (
    <div className="scroll-title-container">
      <div className="scroll-title">
        <div
          className={`title-item ${!nowTitle ? "selected" : ""}`}
          onClick={() => onClick()}
        >
          全部
        </div>
        {titleList.map((item, index) => (
          <div
            key={index}
            className={`title-item ${nowTitle === item.id ? "selected" : ""}`}
            onClick={() => onClick(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
