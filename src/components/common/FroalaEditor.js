import React, { Component } from 'react';
import './FroalaEditor.css'
import PropTypes from 'prop-types';
import * as qiniu from 'qiniu-js';
import util from '../../services/Util'

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
import 'froala-editor/js/plugins/file.min';
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

const domain = 'http://cdn-icare.qingtime.cn/';
let selectedImage;
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
    mimeType: ["image/png", "image/jpeg", "image/svg+xml"],
};

class MyFroalaEditor extends Component {
    render() {
        const { data, previewMode, handleChange, uptoken } = this.props;
        const events = {
            'image.beforeUpload': function (images) {
                // Do something here.
                // this is the editor instance.
                selectedImage = images[0];
            },
            'image.inserted': function ($img, response) {
                // Do something here.
                // this is the editor instance.
                let observer = {
                    next(res) {
                    },
                    error(err) {
                        // message.info('上传失败！');
                        // Loading.close();
                    },
                    complete(res) {
                        console.log('res---------', domain + encodeURIComponent(res.key));
                        $img[0].src = domain + encodeURIComponent(res.key);
                    }
                }
                // 上传
                let observable = qiniu.upload(selectedImage, `${util.common.guid(8, 16)}${selectedImage.name.substr(selectedImage.name.lastIndexOf('.'))}`, uptoken, putExtra, qiniuConfig);
                // 上传开始
                observable.subscribe(observer);
            }
        };

        const config = {
            placeholder: "Edit Me",
            events: events,
            // documentReady: true,
            language: 'zh_cn',
            pluginsEnabled: ['align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable', 'embedly', 'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager', 'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', '|', 'fontFamily', 'fontSize', 'color', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            toolbarButtonsXS: ['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'color', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'check', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'insertHR', 'selectAll', 'clearFormatting', '|', 'spellChecker', '|', 'undo', 'redo'],
        };
        return (
            <div className="my-froala-editor" >
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
            </div >
        )
    }
}

MyFroalaEditor.propTypes = {
    data: PropTypes.string.isRequired,
    previewMode: PropTypes.bool,
    handleChange: PropTypes.func,
}

export default MyFroalaEditor;