import React from "react";
import "./News.css";
import TitleHead from "./TitleHead";

export default function News() {
  return (
    <div className="village-news">
      <TitleHead
        icon="/image/icon/village/volume-up-outline.svg"
        text="要闻公告"
      />
    </div>
  );
}
