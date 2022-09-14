import React, { Component } from "react";
import "./UploadAvatar.css";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import api from "../../services/Api";
import util from "../../services/Util";
import { message, Button, Spin } from "antd";
import * as qiniu from "qiniu-js";

class UploadAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMask: false,
      imgUrl: props.imgUrl,
      uptoken: null,
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.cropUpload = this.cropUpload.bind(this);
    this.qiniuUpload = this.qiniuUpload.bind(this);
  }

  cropUpload() {
    // image in dataUrl
    if (!this.refs.cropper) {
      return;
    }
    let cutAvater = this.refs.cropper.getCroppedCanvas().toDataURL();
    // 将dataurl转换为Blob对象
    let arr = cutAvater.split(",");
    let data = window.atob(arr[1]);
    let mime = arr[0].match(/:(.*?);/)[1];
    let ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i);
    }
    let blob = new Blob([ia], { type: mime });
    this.qiniuUpload(blob);
  }

  qiniuUpload(blob) {
    const { callback } = this.props;
    let uptoken = this.state.uptoken;
    if (!uptoken) {
      return;
    }

    const domain = "https://cdn-icare.qingtime.cn/";

    let putExtra = {
      // 文件原文件名
      fname: "",
      // 自定义变量
      params: {},
      // 限制上传文件类型
      mimeType: ["image/png", "image/jpeg"],
    };
    let config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 5,
      region: qiniu.region.z0,
    };
    let that = this;
    let observer = {
      next(res) {},
      error(err) {
        that.setState({
          showMask: false,
        });
        message.info("上传失败！");
      },
      complete(res) {
        that.setState({
          showMask: false,
        });
        let url = domain + encodeURIComponent(res.key);
        that.setState({
          imgUrl: url,
        });
        callback(url);
      },
    };
    // 上传
    let observable = qiniu.upload(
      blob,
      `${util.common.guid(8, 16)}.${blob.type.split("/")[1]}`,
      uptoken,
      putExtra,
      config
    );
    this.setState({
      showMask: true,
    });
    // 上传开始
    observable.subscribe(observer);
  }

  handleFileChange(event) {
    const { maxSize } = this.props;
    let files = event.target.files;
    if (!files[0]) {
      return;
    }

    let file = files[0];

    if (file.size > maxSize) {
      message.info(`请选择小于${maxSize / 1024 / 1024}MB的图片`);
      return;
    }

    let that = this;

    // 将file对象（Blob对象）转为base64（dataurl）
    var reader = new FileReader();
    reader.onload = function (e) {
      // target.result 该属性表示目标对象的DataURL
      that.setState({
        imgUrl: e.target.result,
      });
    };
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file);
  }

  render() {
    const { imgUrl, showMask } = this.state;
    return (
      <div className="upload-avatar">
        <i className={`file-upload-button`}>
          <input
            type="file"
            accept="image/*"
            onChange={this.handleFileChange}
          />
          请选择头像
        </i>
        {imgUrl ? (
          <Cropper
            ref="cropper"
            src={imgUrl}
            style={{ height: 300, width: "100%" }}
            aspectRatio={1 / 1}
            guides={false}
          />
        ) : null}
        <Button onClick={this.cropUpload}>裁剪并上传</Button>
        {showMask ? (
          <div className="loading-mask">
            <Spin size="large" />
          </div>
        ) : null}
      </div>
    );
  }

  async componentDidMount() {
    // 获取七牛token
    let res = await api.auth.getUptoken();
    if (res.msg === "OK") {
      this.setState({ uptoken: res.result });
    } else {
      message.info(res.msg);
    }
  }

  componentDidUpdate(prevProps) {
    const { imgUrl: prevImgUrl } = prevProps;
    const { imgUrl } = this.props;
    if (!prevImgUrl && imgUrl) {
      this.setState({
        imgUrl: imgUrl,
      });
    }
  }
}

export default UploadAvatar;
