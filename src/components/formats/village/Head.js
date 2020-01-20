import React from "react";
import { useHistory } from "react-router";

export default function Head() {
  const history = useHistory();
  return (
    <div className="village-stories-head">
      <div>
        <i className="back" onClick={() => history.goBack()}></i>
      </div>
    </div>
  );
}
