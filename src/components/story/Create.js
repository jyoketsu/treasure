import React, { useState } from "react";
import "./Create.css";
import { useHistory } from "react-router-dom";

export default function Create() {
  return (
    <div className="create-story">
      <Head />
      <div className="create-story-content">
        <Content />
      </div>
      <Action />
    </div>
  );
}

function Head() {
  const history = useHistory();
  return (
    <div className="village-stories-head">
      <i className="back" onClick={() => history.goBack()}></i>
    </div>
  );
}

function Action() {
  return <div className="create-action"></div>;
}

function Content() {
  const [value, setValue] = useState("");
  return (
    <div className="content-wrapper">
      <div className="create-text">
        <div className="text-wrapper">
          <pre className="content">{value}</pre>
          <textarea
            placeholder="说点什么吧..."
            value={value}
            onChange={e => setValue(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="images-wrapper"></div>
    </div>
  );
}
