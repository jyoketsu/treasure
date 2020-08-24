import React from "react";
import "./PortalCatalogMobile.css";
import { useHistory, useRouteMatch } from "react-router";
import util from "../../../services/Util";
import { asyncStart, asyncEnd } from "../../../actions/app";
import { useSelector, useDispatch } from "react-redux";

export default function PortalCatalogMobile({ tagList, user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const channelKey = match.params.id;
  const nowStation = useSelector((state) => state.station.nowStation);

  async function handleClick(tag) {
    asyncStart(dispatch);
    const result = await util.operation.handleClickTag(
      nowStation._key,
      nowStation.domain,
      channelKey,
      tag.id,
      user
    );
    asyncEnd(dispatch);

    if (result) {
      history.push({
        pathname: `/${nowStation.domain}/home/detail/${channelKey}`,
        state: { tagId: tag.id, tagName: tag.name },
      });
    }
  }

  return (
    <div className="portal-catalogs-mobile">
      {tagList.map((tagItem, index) => (
        <Catalog key={index} catalog={tagItem} onClick={handleClick} />
      ))}
    </div>
  );
}

function Catalog({ catalog, onClick }) {
  let obj;
  if (util.common.isJSON(catalog)) {
    obj = JSON.parse(catalog);
  } else {
    obj = { id: catalog, name: catalog };
  }
  return (
    <div
      className="portal-catalog-mobile"
      style={{ backgroundImage: `url(${obj.logo})` }}
      onClick={() => onClick(obj)}
    >
      <div>
        <span>{obj.name}</span>
      </div>
    </div>
  );
}
