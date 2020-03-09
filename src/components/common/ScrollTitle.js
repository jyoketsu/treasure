import React, { useState, useRef, useEffect } from "react";
import "./ScrollTitle.css";

export default function ScrollTitle({ titleList, nowTitle, onClick }) {
  const [offset, setoffset] = useState(0);
  const tabsEl = useRef(0);
  const tabsContainerEl = useRef(0);
  const titleWidth = 90;

  useEffect(() => {
    let index;
    for (let i = 0; i < titleList.length; i++) {
      const element = titleList[i];
      if (nowTitle === element.id) {
        index = i;
        break;
      }
    }
    const tabsWidth = tabsEl.current.clientWidth;
    const containerWidth = tabsContainerEl.current.clientWidth;
    const nowX = index * titleWidth;
    // 容器1/3位置
    const middleX = containerWidth / 3;
    // 内容长度与容器长度的差
    const differ = tabsWidth - containerWidth;
    // 自动移动
    if (differ > 0) {
      if (nowX > middleX && nowX < differ) {
        setoffset(-(nowX - middleX));
      } else if (nowX > differ) {
        setoffset(-differ);
      } else {
        setoffset(0);
      }
    }
  }, [nowTitle, titleList]);

  return (
    <div className="scroll-title-container" ref={tabsContainerEl}>
      <div
        className="scroll-title"
        style={{ transform: `translate(${offset}px, 0)` }}
        ref={tabsEl}
      >
        <div
          className={`title-item ${!nowTitle ? "selected" : ""}`}
          style={{ width: titleWidth }}
          onClick={() => onClick("")}
        >
          全部
        </div>
        {titleList.map((item, index) => (
          <div
            key={index}
            className={`title-item ${nowTitle === item.id ? "selected" : ""}`}
            style={{ width: titleWidth }}
            onClick={() => onClick(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
