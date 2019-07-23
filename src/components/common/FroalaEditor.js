import React, { Component } from 'react';
import './FroalaEditor.css'
import PropTypes from 'prop-types';
import * as qiniu from 'qiniu-js';
import util from '../../services/Util';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/languages/zh_cn';
import 'froala-editor/js/plugins/align.min';
import 'froala-editor/js/plugins/char_counter.min';
import 'froala-editor/js/plugins/code_beautifier.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/colors.min';
import 'froala-editor/js/plugins/draggable.min';
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/plugins/font_family.min';
import 'froala-editor/js/plugins/font_size.min';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/image.min';
import 'froala-editor/js/plugins/image_manager.min';
import 'froala-editor/js/plugins/inline_style.min';
import 'froala-editor/js/plugins/line_breaker.min';
import 'froala-editor/js/plugins/link.min';
import 'froala-editor/js/plugins/lists.min';
import 'froala-editor/js/plugins/paragraph_format.min';
import 'froala-editor/js/plugins/paragraph_style.min';
import 'froala-editor/js/plugins/quick_insert.min';
import 'froala-editor/js/plugins/quote.min';
import 'froala-editor/js/plugins/save.min';
import 'froala-editor/js/plugins/table.min';
import 'froala-editor/js/plugins/url.min';
import 'froala-editor/js/plugins/video.min';
import 'froala-editor/js/plugins/word_paste.min';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

import { Menu } from 'antd';
const { SubMenu } = Menu;

const domain = 'http://cdn-icare.qingtime.cn/';
let selectedFile;
let qiniuConfig = {
    useCdnDomain: true,
    disableStatisticsReport: false,
    retryCount: 5,
    region: qiniu.region.z0
};

let putExtra = {
    // 文件原文件名
    fname: "",
    // 自定义变量
    params: {},
    // 限制上传文件类型
    mimeType: ["image/png", "image/jpeg", "image/svg+xml", "video/mp4"],
};

class MyFroalaEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeArr: [],
            top: 70,
        }
        this.createMenu = this.createMenu.bind(this);
        this.recursionMenu = this.recursionMenu.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }

    clickEditor(type, index) {
        // let editorBody = document.getElementsByTagName('body')[0]
        let editor = document.getElementsByClassName("fr-view")[0];
        let target = editor.getElementsByTagName(type)[index];

        document.documentElement.scrollTop = target.offsetTop;
    }

    createMenu(data) {
        let { typeArr } = this.state;
        let doc = new DOMParser().parseFromString(data, "text/html");
        typeArr = [];
        let h1Num = 0;
        let h2Num = 0;
        let h3Num = 0;
        let walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);
        let node = walker.nextNode();
        let temp = [];
        let maxHead = 4;
        while (node !== null) {
            if (node.innerText.trim() !== "") {
                if (node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4") {
                    temp.push(node);
                    const nowHead = parseInt(node.tagName.substr(1), 10);
                    if (nowHead < maxHead) {
                        maxHead = nowHead;
                    }
                }
            }
            node = walker.nextNode();
        }
        let array = [];
        for (let i = 0; i < temp.length; i++) {
            switch (temp[i].tagName) {
                case 'H1':
                    typeArr.push({
                        name: temp[i].innerText,
                        submenuItem: [],
                        num: h1Num,
                        type: "h1"
                    });
                    h1Num++;
                    break;
                case 'H2':
                    switch (maxHead) {
                        case 1:
                            array = typeArr[typeArr.length - 1].submenuItem;
                            break;
                        case 2:
                            array = typeArr;
                            break;
                        default:
                            break;
                    }
                    array.push({
                        name: temp[i].innerText,
                        submenuItem: [],
                        num: h2Num,
                        type: "h2"
                    });
                    h2Num++;
                    break;
                case 'H3':
                    switch (maxHead) {
                        case 1:
                            array = typeArr[typeArr.length - 1].submenuItem[
                                typeArr[typeArr.length - 1].submenuItem.length - 1].submenuItem
                            break;
                        case 2:
                            array = typeArr[typeArr.length - 1].submenuItem;
                            break;
                        case 3:
                            array = typeArr;
                            break;
                        default:
                            break;
                    }
                    array.push({
                        name: temp[i].innerText,
                        submenuItem: [],
                        num: h3Num,
                        type: "h3"
                    });
                    h3Num++;
                    break;
                default:
                    break;
            }
        }

        let subs = [];
        for (let i = 0; i < typeArr.length; i++) {
            subs.push(`sub-${i}`);
        }

        this.setState({
            typeArr: typeArr,
            subs: subs,
        })
    }

    recursionMenu(dataSource, prefix) {
        return dataSource.map((item, index) => {
            let result;
            if (!item.submenuItem || item.submenuItem.length === 0) {
                result = <Menu.Item key={prefix ? `prefix-${index}` : index} onClick={() => { this.clickEditor(item.type, item.num) }}>{item.name}</Menu.Item>
            } else {
                result = <SubMenu key={`sub-${prefix ? `prefix-${index}` : index}`} title={item.name} onTitleClick={() => { this.clickEditor(item.type, item.num) }}>
                    {this.recursionMenu(item.submenuItem, index)}
                </SubMenu>;
            }
            return result;
        });
    }

    qiniuUpload(uptoken, target, file, isVideo) {
        let observer = {
            next(res) {
            },
            error(err) {
                alert('上传失败！');
            },
            complete(res) {
                const url = domain + encodeURIComponent(res.key);
                if (isVideo) {
                    target.innerHTML = `<video src="${url}" style="width: 600px;" controls="" class="fr-draggable">您的浏览器不支持 HTML5 视频。</video>`;
                } else {
                    target.src = url;
                }
            }
        }
        // 上传
        let observable = qiniu.upload(file, `${util.common.guid(8, 16)}${file.name.substr(file.name.lastIndexOf('.'))}`, uptoken, putExtra, qiniuConfig);
        // 上传开始
        observable.subscribe(observer);
    }

    render() {
        const { data, previewMode, handleChange, uptoken, hideMenu, } = this.props;
        const { typeArr, subs, top, } = this.state;
        const that = this;
        const events = {
            'image.beforeUpload': function (images) {
                // Do something here.
                // this is the editor instance.
                selectedFile = images[0];
            },
            'image.inserted': function ($img, response) {
                // Do something here.
                // this is the editor instance.
                that.qiniuUpload(uptoken, $img[0], selectedFile);
            },
            'video.beforeUpload': function (videos) {
                // Return false if you want to stop the video upload.
                selectedFile = videos[0];
            },
            'video.inserted': function ($video) {
                that.qiniuUpload(uptoken, $video[0], selectedFile, true);
            }
        };

        const config = {
            placeholder: "Edit Me",
            events: events,
            documentReady: true,
            language: 'zh_cn',
            pluginsEnabled: ['align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable', 'embedly', 'emoticons', 'entities', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsXS: ['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'color', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', '|', 'undo', 'redo'],
        };
        return (
            <div className="my-froala-editor-container">

                {
                    !hideMenu && previewMode && typeArr.length ?
                        <div className="editor-menu">
                            <Menu
                                style={{
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    position: 'fixed',
                                    width: '350px',
                                    top: `${top}px`,
                                    height: `${window.innerHeight - top}px`
                                }}
                                mode="inline"
                                inlineCollapsed={false}
                                defaultOpenKeys={subs}
                            >
                                {this.recursionMenu(typeArr)}
                            </Menu>
                        </div> : null
                }

                <div className="editor-container">
                    <div className={`my-froala-editor ${previewMode ? 'preview' : ''}`}>
                        {
                            previewMode ?
                                <FroalaEditorView
                                    model={data} /> :
                                <FroalaEditor
                                    tag='textarea'
                                    model={data}
                                    config={config}
                                    onModelChange={handleChange}
                                />
                        }
                    </div>
                </div>
            </div >
        )
    }

    handleMouseWheel() {
        const { top } = this.state;
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop < 100) {
            if (top === 0) {
                this.setState({ top: 70 });
            }
        } else {
            if (top === 70) {
                this.setState({ top: 0 });
            }
        }
    }

    componentDidMount() {
        document.body.addEventListener('wheel', this.handleMouseWheel);
    }

    componentWillUnmount() {
        document.body.removeEventListener('wheel', this.handleMouseWheel);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.data && this.props.data) {
            this.createMenu(this.props.data);
        }
    }
}

MyFroalaEditor.propTypes = {
    data: PropTypes.string,
    previewMode: PropTypes.bool,
    handleChange: PropTypes.func,
}

export default MyFroalaEditor;