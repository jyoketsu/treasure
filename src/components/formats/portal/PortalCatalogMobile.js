import React from "react";
import "./PortalCatalogMobile.css";
import { useLocation, useHistory, useRouteMatch } from "react-router";
import util from "../../../services/Util";

export default function PortalCatalogMobile({ tagList }) {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const pathname = location.pathname;
  const stationDomain = pathname.split("/")[1];
  const channelKey = match.params.id;

  function handleClick(tag) {
    history.push({
      pathname: `/${stationDomain}/home/detail/${channelKey}`,
      state: { tagId: tag.id, tagName: tag.name }
    });
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
