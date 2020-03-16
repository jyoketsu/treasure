import React, { useState, useEffect } from "react";
import "./ChannelSubscribe.css";
import util from "../../services/Util";
import { Modal, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  searchStation,
  subscribeChannel,
  getSubscribeChannels,
  clearSubscribeChannels,
  clearSearchStation
} from "../../actions/app";

export default function ChannelSubscribe() {
  const { Search } = Input;
  const [visible, setvisible] = useState(false);
  const dispatch = useDispatch();

  const sites = useSelector(state => state.station.matchedStationList);
  const subscribeChannels = useSelector(
    state => state.station.subscribeChannels
  );

  let channelKey = util.common.getQueryString("key");

  useEffect(() => {
    getSubscribeChannels(channelKey, dispatch);
    return () => {
      clearSubscribeChannels(dispatch);
      clearSearchStation(dispatch);
    };
  }, [channelKey, dispatch]);
  return (
    <div className="channel-subscribe">
      <span onClick={() => setvisible(true)}>频道收听</span>
      <Modal
        title="频道收听"
        visible={visible}
        onCancel={() => setvisible(false)}
        footer={null}
      >
        <Search
          placeholder="请输入要搜索的站点名称"
          onSearch={value => searchStation(value, 1, 1000, 1, dispatch)}
          style={{ width: 200 }}
        />
        <SiteList sites={sites} type="search" />
        <SiteList sites={subscribeChannels} type="result" />
      </Modal>
    </div>
  );
}

function SiteList({ sites, type }) {
  return (
    <div className="channel-subscribe-sites">
      {sites.length ? (
        <h3 style={{ marginTop: "15px" }}>
          {type === "search" ? "搜索结果" : "订阅的频道"}
        </h3>
      ) : null}
      {sites.map((site, index) => (
        <Site key={index} site={site} type={type} />
      ))}
    </div>
  );
}

function Site({ site, type }) {
  const channels = site.seriesInfo;
  const [visible, setvisible] = useState(false);
  return (
    <div className="search-result-site">
      <span onClick={() => setvisible(prevVisible => !prevVisible)}>
        <i className={visible ? "result-site-on" : "result-site-off"}></i>
        {site.name}
      </span>
      {visible ? (
        <div className="site-channels">
          {channels.map((channel, index) => (
            <Channel key={index} channel={channel} type={type} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Channel({ channel, type }) {
  let channelKey = util.common.getQueryString("key");
  const dispatch = useDispatch();

  let link;
  switch (channel.status) {
    case 0:
      link = (
        <span
          className="channel-subscribe-action"
          onClick={() =>
            subscribeChannel(type, channelKey, channel._key, 4, 1, dispatch)
          }
        >
          申请订阅
        </span>
      );
      break;
    case 2:
      link = (
        <span
          className="channel-subscribe-action"
          onClick={() =>
            subscribeChannel(type, channelKey, channel._key, 4, 2, dispatch)
          }
        >
          取消订阅
        </span>
      );
      break;
    case 4:
      link = <span className="channel-subscribe-action applied">已申请</span>;
      break;
    default:
      if (type === "search") {
        link = (
          <span
            className="channel-subscribe-action"
            onClick={() =>
              subscribeChannel(type, channelKey, channel._key, 4, 1, dispatch)
            }
          >
            申请订阅
          </span>
        );
      }
      break;
  }
  return (
    <div className="site-channel">
      <span>{`・${channel.name}`}</span>
      {link}
    </div>
  );
}
