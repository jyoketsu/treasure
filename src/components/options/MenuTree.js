import React, { useState, useEffect } from "react";
import "./MenuTree.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addMenu,
  getMenuTree,
  deleteMenu,
  updateMenu,
  getChannelStoryList,
  getStoryDetail,
  clearStoryDetail,
} from "../../actions/app";
import { Tree, Button, Modal, Input, message, List, Switch } from "antd";
import util from "../../services/Util";
import Story from "../story/Story";
import ArticlePreview from "../story/Article";

const confirm = Modal.confirm;

export default function MenuTree() {
  const seriesKey = util.common.getQueryString("key");
  const dispatch = useDispatch();

  const [treeData, settreeData] = useState([]);
  const [selectedKey, setselectedKey] = useState(null);
  const [curPage, setcurPage] = useState(1);
  const [selectedArticleKey, setselectedArticleKey] = useState(null);

  const nowStation = useSelector((state) => state.station.nowStation);
  const treeMembers = useSelector((state) => state.station.treeMembers);
  const rootKey = useSelector((state) => state.station.rootKey);
  const story = useSelector((state) => state.story.story);

  useEffect(() => {
    dispatch(clearStoryDetail());
    dispatch(getMenuTree(seriesKey));
  }, [dispatch, seriesKey]);

  useEffect(() => {
    dispatch(getChannelStoryList(nowStation._key, seriesKey, curPage, 20));
  }, [dispatch, nowStation._key, seriesKey, curPage]);

  useEffect(() => {
    if (!treeMembers || !rootKey) {
      return;
    }
    function generateChildren(node) {
      let children = [];
      const childKeys = node.children;
      for (let index = 0; index < childKeys.length; index++) {
        const childKey = childKeys[index];
        const child = treeMembers[childKey];
        let childChildren = generateChildren(child);
        children.push({
          title: child.name || "未命名",
          key: childKey,
          children: childChildren,
        });
      }
      return children;
    }

    let data = [];
    const root = treeMembers[rootKey];
    const rootChildren = root.children;
    for (let index = 0; index < rootChildren.length; index++) {
      const childKey = rootChildren[index];
      const child = treeMembers[childKey];
      let children = generateChildren(child);
      data.push({
        title: child.name || "未命名",
        key: childKey,
        children,
      });
    }
    settreeData(data);
  }, [treeMembers, rootKey]);

  function handleMenuSelect(selectedKeys) {
    const node = treeMembers[selectedKeys[0]];
    if (node) {
      setselectedKey(selectedKeys[0]);
      setselectedArticleKey(node.albumKey);
      if (node.albumKey) {
        dispatch(getStoryDetail(node.albumKey));
      } else {
        dispatch(clearStoryDetail());
      }
    }
  }

  let article = null;
  const storyType = story ? story.type : null;
  switch (storyType) {
    case 6:
      article = <Story readOnly={true} inline={true} />;
      break;
    case 9:
      article = (
        <ArticlePreview readOnly={true} hideMenu={true} inline={true} />
      );
      break;
    default:
      break;
  }

  return (
    <div className="menu-tree-wrapper">
      <div className="menu-tree-toolbar">
        <Toolbar
          selectedKey={selectedKey}
          curPage={curPage}
          setcurPage={setcurPage}
          selectedArticleKey={selectedArticleKey}
          setselectedArticleKey={setselectedArticleKey}
        />
      </div>
      <div className="menu-tree-body">
        <div className="tree-wrapper">
          {treeData.length ? (
            <Tree
              defaultExpandAll
              onSelect={(selectedKeys) => handleMenuSelect(selectedKeys)}
              // onCheck={onCheck}
              treeData={treeData}
            />
          ) : (
            <div>暂无数据</div>
          )}
        </div>
        <div className="article-wrapper">
          {story && story._key ? (
            article
          ) : (
            <div className="menu-no-story">还没有关联文章</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toolbar({
  selectedKey,
  curPage,
  setcurPage,
  selectedArticleKey,
  setselectedArticleKey,
}) {
  const seriesKey = util.common.getQueryString("key");

  const [visible, setvisible] = useState(false);
  const [articleVisible, setarticleVisible] = useState(false);
  const [name, setname] = useState();

  const rootKey = useSelector((state) => state.station.rootKey);
  const treeMembers = useSelector((state) => state.station.treeMembers);
  const channelStoryList = useSelector((state) => state.story.channelStoryList);
  const channelStoryNumber = useSelector(
    (state) => state.story.channelStoryNumber
  );

  const dispatch = useDispatch();

  function handleAdd(type) {
    if (selectedKey) {
      dispatch(addMenu(seriesKey, type, selectedKey));
    } else {
      // 在根节点下创建第一个子节点
      if (rootKey) {
        dispatch(addMenu(seriesKey, 1, rootKey));
      }
    }
  }

  function showDeleteConfirm() {
    if (!selectedKey) {
      return message.error("请先选中节点！");
    }
    const node = treeMembers[selectedKey];
    confirm({
      title: "删除目录节点",
      content: `确定要删除【${node.name || "未命名"}】吗？`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        dispatch(deleteMenu(seriesKey, selectedKey));
      },
    });
  }

  function handleOpenModal() {
    if (selectedKey) {
      setname(treeMembers[selectedKey].name);
      setvisible(true);
    } else {
      message.error("请先选中节点！");
    }
  }

  function handleOpenArticleModal() {
    if (selectedKey) {
      setarticleVisible(true);
    } else {
      message.error("请先选中节点！");
    }
  }

  function handleUpdate() {
    dispatch(updateMenu(selectedKey, { name }));
    setvisible(false);
  }

  function handleCheck(checked, articleKey) {
    if (checked) {
      setselectedArticleKey(articleKey);
    } else {
      setselectedArticleKey(null);
    }
  }

  function handleLink() {
    if (selectedArticleKey) {
      dispatch(updateMenu(selectedKey, { albumKey: selectedArticleKey }));
      setarticleVisible(false);
    } else {
      message.error("没有选择任何文章！");
    }
  }

  return (
    <div className="menu-tree-toolbar">
      <Button icon="plus" shape="round" onClick={() => handleAdd(2)}>
        添加目录
      </Button>
      <Button icon="plus-circle" shape="round" onClick={() => handleAdd(1)}>
        添加子目录
      </Button>
      <Button icon="edit" shape="round" onClick={handleOpenModal}>
        目录改名
      </Button>
      <Button icon="file-text" shape="round" onClick={handleOpenArticleModal}>
        关联文章
      </Button>
      <Button icon="delete" shape="round" onClick={showDeleteConfirm}>
        删除目录
      </Button>
      <Modal
        title="目录改名"
        visible={visible}
        onOk={handleUpdate}
        okText="确定"
        cancelText="取消"
        onCancel={() => setvisible(false)}
      >
        <Input
          placeholder="请输入目录名"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
      </Modal>
      <Modal
        wrapClassName="link-article-wrap"
        title="关联文章"
        visible={articleVisible}
        onOk={handleLink}
        okText="关联"
        cancelText="取消"
        onCancel={() => setarticleVisible(false)}
        width={960}
        style={{ top: "50px" }}
        bodyStyle={{
          maxHeight: document.body.clientHeight - 200,
          overflow: "auto",
        }}
        maskStyle={{ zIndex: 500 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={channelStoryList}
          pagination={{
            current: curPage,
            total: channelStoryNumber,
            pageSize: 20,
            onChange: (page) => setcurPage(page),
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Switch
                  key={`switch-${item._key}`}
                  size="small"
                  checked={item._key === selectedArticleKey ? true : false}
                  onChange={(checked) => handleCheck(checked, item._key)}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={`${item.memo}...`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
