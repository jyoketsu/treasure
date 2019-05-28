import React, { Component } from 'react';
import './Form.css';
import { message } from 'antd';
import Loading from './Loading';
import api from '../../services/Api';
import * as qiniu from 'qiniu-js';
import ClickOutside from './ClickOutside';
import { DatePicker } from 'antd';
import moment from 'moment';
import util from '../../services/Util';

class FormGroup extends Component {
    render() {
        return (
            <div className={`form-group ${this.props.className}`} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

class Button extends Component {
    render() {
        // this.props.buttonType: "formButton":"一般表單按鈕"  "noBorder":"無邊框按鈕"
        return (
            this.props.disabled ?
                <button
                    id={this.props.id}
                    className={`my-button btn btn-default ${this.props.buttonType}`}
                    aria-label="Settings"
                    style={this.props.style}
                    onClick={this.props.onClick} disabled>
                    <i className={this.props.icon} aria-hidden="true"></i>
                    {this.props.text}
                </button> :
                <button
                    id={this.props.id}
                    className={`my-button btn btn-default ${this.props.buttonType}`}
                    aria-label="Settings"
                    style={this.props.style}
                    onClick={this.props.onClick}>
                    <i className={this.props.icon} aria-hidden="true"></i>
                    {this.props.text}
                </button>
        );
    }
}

class IconButton extends Component {
    render() {
        let iconStyle = { backgroundImage: `url('${this.props.icon}')` };
        return (
            <button className="icon-button" style={this.props.style} onClick={this.props.onClick}>
                <i style={iconStyle}></i>
                {this.props.text}
            </button>
        )
    }
}

class CheckBox extends Component {
    render() {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" name={this.props.name} onChange={this.props.onChange} /> {this.props.text}
                </label>
            </div>
        );
    }
}

class Space extends Component {
    render() {
        return (
            <div className="space" style={{ width: this.props.width }}></div>
        );
    }
}

class Link extends Component {
    render() {
        const { style, text, handleClick } = this.props;
        return (
            <span className="my-link" style={style} onClick={handleClick}>{text}</span>
        );
    }
}

// 文本输入框
class TextInput extends Component {
    render() {
        return (
            <input
                className="text-input"
                type={this.props.inputType}
                placeholder={this.props.placeHolder}
                style={{ width: this.props.width || "100%" }}
                name={this.props.name}
                onChange={this.props.onChange} />
        );
    }
}

// 下拉框
class Select extends Component {
    constructor(props) {
        super(props);
        this.value = '';
        const defaultValue = this.props.defaultValue;
        let defaultText;
        const selectOptions = this.props.options;
        for (let i = 0; i < selectOptions.length; i++) {
            if (selectOptions[i].value === defaultValue) {
                defaultText = selectOptions[i].text;
                break;
            }
        }
        this.state = {
            _key: this.props._key,
            options: false,
            text: defaultText || '',
        };
        this.switchOptions = this.switchOptions.bind(this);
    }

    switchOptions() {
        this.setState((prevState) => ({
            options: !prevState.options
        }));
    }

    handleOptionClick(option) {
        this.value = option.value;
        this.props.onChange({ target: { name: this.props.name, value: this.value } });
        this.setState({
            options: false,
            text: option.text
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._key !== prevState._key) {
            let defaultText;
            const selectOptions = nextProps.options;
            for (let i = 0; i < selectOptions.length; i++) {
                if (selectOptions[i].value === nextProps.defaultValue) {
                    defaultText = selectOptions[i].text;
                    break;
                }
            }
            return {
                _key: nextProps._key,
                text: defaultText || '',
            };
        } else {
            return null;
        }
    }

    render() {
        let icon = this.props.icon ? <i className={`select-icon ${this.props.icon}`}></i> : null;
        const selectOptions = this.props.options;
        let options =
            <ul className="select-options">
                {selectOptions.map((option, index) => (
                    <li key={index} onClick={this.handleOptionClick.bind(this, option)}>{option.text}</li>
                ))}
            </ul>;
        return (
            <div className="my-select" style={this.props.style}>
                <input type="text" name={this.props.name}
                    value={this.state.text}
                    placeholder={this.props.placeholder}
                    onClick={this.switchOptions}
                    readOnly />
                {icon}
                <i className="select-arrow"></i>
                {this.state.options ? options : null}
            </div>
        );
    }
}

// select2
class DropDownButton extends Component {
    constructor(props) {
        super(props);
        this.value = '';
        this.state = {
            value: '',
            showOptions: false,
            text: ''
        };
        this.switchOptions = this.switchOptions.bind(this);
        this.collapseOptions = this.collapseOptions.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    // 切换下拉框是否显示
    switchOptions() {
        this.setState((prevState) => ({
            showOptions: !prevState.options
        }));
    }
    // 收起下拉框
    collapseOptions() {
        this.setState({
            showOptions: false,
        });
    }

    handleOptionClick(option) {
        this.value = option.value;
        this.setState({
            showOptions: false,
            value: option.value,
            text: option.text,
        });
        this.props.onChange({ target: { name: this.props.name, value: this.value } });
    }

    componentDidMount() {
        const { value, options } = this.props;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === value) {
                this.setState({ text: options[i].text });
                break;
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            let options = nextProps.options;
            let text = '';
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === nextProps.value) {
                    text = options[i].text;
                    break;
                }
            }
            return {
                text: text,
            }
        } else {
            return null;
        }
    }

    render() {
        let icon = this.props.icon ? <i className={`select-icon ${this.props.icon}`}></i> : null;
        const selectOptions = this.props.options;
        let options =
            <ul className="select-options">
                {selectOptions.map((option, index) => (
                    <li key={index} onClick={this.handleOptionClick.bind(this, option)}>{option.text}</li>
                ))}
            </ul>;
        return (
            <ClickOutside onClickOutside={this.collapseOptions}>
                <div className={`my-select dropdown-button ${this.props.className || ''}`}
                    style={this.props.style}
                    onClick={this.switchOptions}
                >
                    <input type="text" name={this.props.name}
                        value={this.state.text || this.props.value}
                        placeholder={this.props.placeholder}
                        // onClick={this.switchOptions}
                        readOnly />
                    {icon}
                    <i className="select-arrow"></i>
                    {this.state.showOptions ? options : null}
                </div>
            </ClickOutside>
        );
    }
}

// 表单文本输入框 (教育经历)
class FormTextInput extends Component {
    constructor(props) {
        super(props);
        this.setColumn = this.setColumn.bind(this);
    }

    setColumn(value) {
        this.props.onChange(this.props.name, value.format('YYYY-MM-DD'));
    }

    render() {
        const { showType, type } = this.props;
        let textInput = null;
        const className = this.props.label ? 'my-text-input' : 'my-text-input nolabel';
        if (showType === "show") {
            textInput =
                <div className={className} style={this.props.style}>
                    {this.props.label ? <label>{this.props.label}</label> : null}
                    <input name={this.props.name} value={this.props.value} placeholder={this.props.placeholder}
                        onChange={this.props.onChange} disabled />
                    {this.props.children}
                </div>;
        } else {
            switch (type) {
                case 'time':
                    textInput =
                        <div className={className} style={this.props.style}>
                            {this.props.label ? <label>{this.props.label}</label> : null}
                            <DatePicker placeholder={this.props.placeholder}
                                defaultValue={this.props.value ? moment(this.props.value, 'YYYY-MM-DD') : ''}
                                onChange={this.setColumn} />
                            {this.props.children}
                        </div>;
                    break;
                default: textInput =
                    <div className={className} style={this.props.style}>
                        {this.props.label ? <label>{this.props.label}</label> : null}
                        <input type={this.props.type} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} />
                        {this.props.children}
                    </div>;
                    break;
            }
        }
        return (
            textInput
        );
    }
}

// 开关
class Switch extends Component {
    render() {
        const { name, value, onChange, style } = this.props;
        return (
            <button
                style={style}
                className={`my-switch ${value ? 'switch-on' : 'switch-off'}`}
                name={name}
                value={value}
                onClick={onChange}></button>
        );
    }
}


// 上传文件按钮
class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.state = {
            uptoken: null
        }

        switch (this.props.metaType) {
            case 'image': this.mimeType = ["image/png", "image/jpeg"]; this.accept = ".jpg, .jpeg, .png"; break;
            case 'video': this.mimeType = ["video/mp4", "video/ogg"]; this.accept = ".mp4, .ogg"; break;
            default: this.mimeType = ["image/png", "image/jpeg"]; this.accept = ".jpg, .jpeg, .png"; break;
        }
    }

    handleFileChange(event) {
        const { maxSize } = this.props;
        let uptoken = this.state.uptoken;
        if (!uptoken) {
            return;
        }

        let that = this;
        const domain = 'http://cdn-icare.qingtime.cn/';
        let files = event.target.files;
        if (!files[0]) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                message.error(`请选择小于${maxSize / 1000000}MB的图片，请压缩并保留元数据。`);
                return;
            }
        }

        let putExtra = {
            // 文件原文件名
            fname: "",
            // 自定义变量
            params: {},
            // 限制上传文件类型
            mimeType: this.mimeType,
        };
        let config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 5,
            region: qiniu.region.z0
        };
        let uploaded = [];
        let observer = {
            next(res) {
            },
            error(err) {
                message.error('上传失败！');
                Loading.close();
            },
            complete(res) {
                uploaded.push(domain + encodeURIComponent(res.key));
                if (uploaded.length === files.length) {
                    message.success('上传成功');
                    that.props.callback(uploaded, that.props.extParam);
                    Loading.close();
                }
            }
        }
        Loading.open({ text: '上传中，请稍候...' });
        // 上传
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // let observable = qiniu.upload(file, encodeURIComponent(file.name), uptoken, putExtra, config);
            let observable = qiniu.upload(file, `${util.common.guid(8, 16)}${file.name.substr(file.name.lastIndexOf('.'))}`, uptoken, putExtra, config);
            // 上传开始
            observable.subscribe(observer);
        }

    }
    async componentDidMount() {
        // 获取七牛token
        let res = await api.auth.getUptoken(localStorage.getItem('TOKEN'));
        if (res.msg === 'OK') {
            this.setState({ uptoken: res.result });
        } else {
            message.error(res.msg);
        }
    }
    render() {
        let fileInput = null;
        if (this.props.multiple) {
            fileInput = <input type="file" accept='image/*' onChange={this.handleFileChange} multiple />
        } else {
            fileInput = <input type="file" accept='image/*' onChange={this.handleFileChange} />
        }
        return (
            <i className={`file-upload-button ${this.props.className}`} style={this.props.style}>
                {fileInput}
                {this.props.text}
            </i>
        );
    }
}


export {
    FormGroup,
    Button,
    IconButton,
    TextInput,
    FormTextInput,
    Space,
    CheckBox,
    Link,
    FileUpload,
    Select,
    Switch,
    DropDownButton,
}