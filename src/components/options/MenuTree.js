import React, { useState, useEffect } from "react";
import "./MenuTree.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addMenu,
  getMenuTree,
  deleteMenu,
  updateMenu,
} from "../../actions/app";
import { Tree, Button, Modal, Input, message } from "antd";
import util from "../../services/Util";

const confirm = Modal.confirm;

export default function MenuTree() {
  const seriesKey = util.common.getQueryString("key");
  const dispatch = useDispatch();
  const [treeData, settreeData] = useState([]);
  const [selectedKey, setselectedKey] = useState(null);
  const treeMembers = useSelector((state) => state.station.treeMembers);
  const rootKey = useSelector((state) => state.station.rootKey);

  useEffect(() => {
    dispatch(getMenuTree(seriesKey));
  }, [dispatch, seriesKey]);

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

  return (
    <div className="menu-tree-wrapper">
      <div className="menu-tree-toolbar">
        <Toolbar selectedKey={selectedKey} />
      </div>
      <div className="menu-tree-body">
        <div className="tree-wrapper">
          {treeData.length ? (
            <Tree
              defaultExpandAll
              onSelect={(selectedKeys) => setselectedKey(selectedKeys[0])}
              // onCheck={onCheck}
              treeData={treeData}
            />
          ) : (
            <div>暂无数据</div>
          )}
        </div>
        <div className="article-wrapper">文章显示</div>
      </div>
    </div>
  );
}

function Toolbar({ selectedKey }) {
  const seriesKey = util.common.getQueryString("key");

  const [visible, setvisible] = useState(false);
  const [name, setname] = useState();

  const rootKey = useSelector((state) => state.station.rootKey);
  const treeMembers = useSelector((state) => state.station.treeMembers);

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

  function handleUpdate() {
    dispatch(updateMenu(selectedKey, { name }));
    setvisible(false);
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
    </div>
  );
}
