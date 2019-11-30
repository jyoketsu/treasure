import React, { Component } from "react";
import "./StationBasicInfo.css";
import util from "../../services/Util";
import { Form, Input, Button, message, Radio, Switch } from "antd";
import { HOST_NAME } from "../../global";
import UploadStationCover from "../common/UploadCover";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { editStation, createStation } from "../../actions/app";

const { TextArea } = Input;

const mapStateToProps = state => ({
  stationList: state.station.stationList,
  loading: state.common.loading,
  flag: state.common.flag
});

const CustomizedForm = Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value
      }),
      domain: Form.createFormField({
        ...props.domain,
        value: props.domain.value
      }),
      url: Form.createFormField({
        ...props.url,
        value: props.url.value
      }),
      memo: Form.createFormField({
        ...props.memo,
        value: props.memo.value
      }),
      inheritedMode: Form.createFormField({
        ...props.inheritedMode,
        value: props.inheritedMode.value
      }),
      showAll: Form.createFormField({
        ...props.showAll,
        value: props.showAll.value
      }),
      style: Form.createFormField({
        ...props.style,
        value: props.style.value
      })
    };
  }
})(props => {
  const { getFieldDecorator } = props.form;
  const customBk = props.config.customBk;
  return (
    <Form onSubmit={props.onSubmit}>
      <Form.Item label="站名">
        {getFieldDecorator("name", {
          rules: [
            { required: true, message: "请输入微站名！" },
            { max: 20, message: "不能超过20个字符！" }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="网站地址">
        {getFieldDecorator("domain", {
          rules: [
            { required: true, message: "请输入微站域名！" },
            { pattern: /^[A-Za-z0-9]+$/, message: "请输入英文数字！" },
            { max: 20, message: "不能超过20个字符！" }
          ]
        })(<Input addonBefore={`https://${HOST_NAME}/`} />)}
      </Form.Item>
      <Form.Item label="自定义域名">
        {getFieldDecorator("url", {
          rules: [
            { pattern: /^[A-Za-z0-9.]+$/, message: "请输入正确的域名！" },
            { max: 50, message: "不能超过50个字符！" }
          ]
        })(<Input addonBefore={`https://`} />)}
      </Form.Item>
      <Form.Item label="概述">
        {getFieldDecorator("memo", {
          rules: [
            { required: true, message: "请输入微站概述！" },
            { max: 1000, message: "不能超过1000个字符！" }
          ]
        })(<TextArea rows={6} />)}
      </Form.Item>
      <Form.Item label="网站风格">
        {getFieldDecorator("style", {
          rules: [{ required: true, message: "请选择网站风格！" }]
        })(
          <Radio.Group>
            <Radio value={1}>普通网站</Radio>
            <Radio value={2}>门户网站</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      {props.style.value === 2 ? (
        <div className="custom-config">
          <div className="config-fields">
            <div className="bk-item">
              <label className="form-label">#1：</label>
              <UploadStationCover
                uploadAvatarCallback={props.handleUploadBk}
                extParam={"one"}
                coverUrl={customBk.one ? customBk.one.url : ""}
              />
              <div className="bk-type">
                <label className="form-label">背景类型：</label>
                <Radio.Group
                  onChange={e =>
                    props.handleBkTypeChange("one", e.target.value)
                  }
                  value={customBk.one ? customBk.one.type || 1 : 1}
                >
                  <Radio value={1}>大张</Radio>
                  <Radio value={2}>纹理</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="bk-item">
              <label className="form-label">#2：</label>
              <UploadStationCover
                uploadAvatarCallback={props.handleUploadBk}
                extParam={"two"}
                coverUrl={customBk.two ? customBk.two.url : ""}
              />
              <div className="bk-type">
                <label className="form-label">背景类型：</label>
                <Radio.Group
                  onChange={e =>
                    props.handleBkTypeChange("two", e.target.value)
                  }
                  value={customBk.two ? customBk.two.type || 1 : 1}
                >
                  <Radio value={1}>大张</Radio>
                  <Radio value={2}>纹理</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="bk-item">
              <label className="form-label">#3：</label>
              <UploadStationCover
                uploadAvatarCallback={props.handleUploadBk}
                extParam={"three"}
                coverUrl={customBk.three ? customBk.three.url : ""}
              />
              <div className="bk-type">
                <label className="form-label">背景类型：</label>
                <Radio.Group
                  onChange={e =>
                    props.handleBkTypeChange("three", e.target.value)
                  }
                  value={customBk.three ? customBk.three.type || 1 : 1}
                >
                  <Radio value={1}>大张</Radio>
                  <Radio value={2}>纹理</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="bk-item">
              <label className="form-label">#4：</label>
              <UploadStationCover
                uploadAvatarCallback={props.handleUploadBk}
                extParam={"four"}
                coverUrl={customBk.four ? customBk.four.url : ""}
              />
              <div className="bk-type">
                <label className="form-label">背景类型：</label>
                <Radio.Group
                  onChange={e =>
                    props.handleBkTypeChange("four", e.target.value)
                  }
                  value={customBk.four ? customBk.four.type || 1 : 1}
                >
                  <Radio value={1}>大张</Radio>
                  <Radio value={2}>纹理</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
          <div className="config-preview">
            <div></div>
            <div></div>
          </div>
        </div>
      ) : null}

      <Form.Item label="管理模式">
        {getFieldDecorator("inheritedMode", {
          rules: [{ required: true, message: "请选择管理模式！" }]
        })(
          <Radio.Group>
            <Radio value={1}>全站统一</Radio>
            <Radio value={2}>频道插件独立管理</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="显示全部故事">
        {getFieldDecorator("showAll", { valuePropName: "checked" })(<Switch />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
});

class StationBasicInfo extends Component {
  constructor(props) {
    super(props);
    const { stationInfo } = props;

    this.state = {
      starKey: stationInfo ? stationInfo._key : "",
      cover: stationInfo ? stationInfo.cover : "",
      logo: stationInfo ? stationInfo.logo : "",
      size: stationInfo ? stationInfo.size : "",
      type: stationInfo ? stationInfo.type : "",
      isMainStar: stationInfo ? stationInfo.isMainStar : "",
      config: stationInfo
        ? stationInfo.config || { customBk: {} }
        : { customBk: {} },
      fields: {
        name: {
          value: stationInfo ? stationInfo.name : ""
        },
        domain: {
          value: stationInfo ? stationInfo.domain : ""
        },
        url: {
          value: stationInfo ? stationInfo.url : ""
        },
        memo: {
          value: stationInfo ? stationInfo.memo : ""
        },
        inheritedMode: {
          value: stationInfo ? stationInfo.inheritedMode : ""
        },
        showAll: {
          value: stationInfo ? stationInfo.showAll : true
        },
        style: {
          value: stationInfo ? stationInfo.style : 1
        }
      }
    };
    this.uploadAvatarCallback = this.uploadAvatarCallback.bind(this);
    this.uploadConfigImageCallback = this.uploadConfigImageCallback.bind(this);
    this.handleBkTypeChange = this.handleBkTypeChange.bind(this);
  }

  uploadAvatarCallback(imageUrl, columnName) {
    this.setState({
      [columnName]: imageUrl[0]
    });
  }

  uploadConfigImageCallback(imageUrl, columnName) {
    this.setState(prevState => {
      let customBk = prevState.config.customBk;
      let bk = customBk[columnName] || { type: 1 };
      bk = { ...bk, ...{ url: imageUrl[0] } };

      customBk = {
        ...customBk,
        ...{ [columnName]: bk }
      };
      return { config: { ...prevState.config, ...{ customBk: customBk } } };
    });
  }

  handleBkTypeChange(columnName, value) {
    this.setState(prevState => {
      let customBk = prevState.config.customBk;
      let bk = customBk[columnName] || {};
      bk = { ...bk, ...{ type: value } };

      customBk = {
        ...customBk,
        ...{ [columnName]: bk }
      };
      return { config: { ...prevState.config, ...{ customBk: customBk } } };
    });
  }

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { editStation, createStation } = this.props;
    const {
      fields,
      starKey,
      type,
      isMainStar,
      cover,
      logo,
      config
    } = this.state;

    this.form.validateFields(async (err, values) => {
      if (!err) {
        if (!cover) {
          message.info("请上传封面！");
          console.log("请上传封面！");
          return;
        }
        let size = await util.common.getImageInfo(cover);
        if (starKey) {
          editStation(
            starKey,
            fields.name.value,
            fields.domain.value,
            fields.url.value,
            type,
            fields.memo.value,
            isMainStar,
            cover,
            logo,
            size,
            fields.inheritedMode.value,
            fields.showAll.value,
            fields.style.value,
            config
          );
        } else {
          createStation(
            fields.name.value,
            fields.domain.value,
            fields.url.value,
            1,
            fields.memo.value,
            false,
            cover,
            logo,
            size,
            fields.inheritedMode.value,
            fields.showAll.value,
            fields.style.value,
            config
          );
        }
      }
    });
  };

  render() {
    const { cover, logo, config, fields } = this.state;

    return (
      <div>
        <label className="ant-form-item-required form-label">
          logo：（推荐分辨率：260*70）
        </label>
        <UploadStationCover
          uploadAvatarCallback={this.uploadAvatarCallback}
          extParam={"logo"}
          coverUrl={logo}
        />
        <label className="ant-form-item-required form-label">
          Banner图：（推荐分辨率：1920*523）
        </label>
        <UploadStationCover
          uploadAvatarCallback={this.uploadAvatarCallback}
          extParam={"cover"}
          coverUrl={cover}
        />
        <CustomizedForm
          ref={node => (this.form = node)}
          {...fields}
          config={config}
          onChange={this.handleFormChange}
          onSubmit={this.handleSubmit}
          handleUploadBk={this.uploadConfigImageCallback}
          handleBkTypeChange={this.handleBkTypeChange}
        />
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    const { loading, history, flag } = this.props;
    if (!loading && prevProps.loading) {
      if (flag === "createStation") {
        message.success("创建成功！");
        history.goBack();
      } else if (flag === "editStation") {
        message.success("编辑成功！");
        history.goBack();
      }
    }
  }
}

export default withRouter(
  connect(mapStateToProps, { editStation, createStation })(
    Form.create({ name: "create-station" })(StationBasicInfo)
  )
);
