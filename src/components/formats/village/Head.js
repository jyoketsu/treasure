import React from "react";
import { useHistory } from "react-router";

export default function Head({ title }) {
  const history = useHistory();
  return (
    <div className="village-stories-head">
      <i className="back" onClick={() => history.goBack()}></i>
      <span>{title}</span>
    </div>
  );
}
