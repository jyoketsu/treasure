import React, { Component } from 'react';
import "./MyCKEditor.css";
import PropTypes from 'prop-types';
import util from '../../services/Util';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import * as qiniu from 'qiniu-js';
import Loading from './Loading';

let domain;
let uptoken;

class MyCKEditor extends Component {
    constructor(props) {
        super(props);
        domain = props.domain;
        uptoken = props.uptoken;
    }
    myCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader, domain, uptoken);
        };
    }

    render() {
        const { onInit, data, onChange, disabled, locale } = this.props;
        let toolbar = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'];
        if (document.querySelector('body').offsetWidth < 768) {
            toolbar = ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote'];
        }

        let language = 'en';
        switch (locale) {
            case 'zh': language = 'zh-cn'; break;
            default: language = 'en';
        }

        return (
            <div className={`my-ckeditor ${disabled ? 'disabled' : ''}`}>
                <CKEditor
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    config={{
                        toolbar: toolbar,
                        extraPlugins: [this.myCustomUploadAdapterPlugin],
                        language: language,
                    }}
                    disabled={disabled}
                    onInit={editor => {
                        // You can store the "editor" and use when it is needed.
                        // let toolbars = Array.from(editor.ui.componentFactory.names());
                        // console.log('------------', toolbars);
                        onInit(editor);
                    }}
                    onChange={(event, editor) => {
                        // const data = editor.getData();
                        // console.log({ event, editor, data });
                        onChange();
                    }}
                // onBlur={editor => {
                //     console.log('Blur.', editor);
                // }}
                // onFocus={editor => {
                //     console.log('Focus.', editor);
                // }}
                />
            </div>
        );
    }

}

MyCKEditor.propTypes = {
    domain: PropTypes.string.isRequired,
    uptoken: PropTypes.string.isRequired,
    onInit: PropTypes.func,
    data: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
}

export default MyCKEditor;

class MyUploadAdapter {
    constructor(loader, domain, uptoken) {
        this.loader = loader;
        this.domain = domain;
        this.uptoken = uptoken;
    }
    upload() {
        let loader = this.loader;
        let uptoken = this.uptoken;
        let domain = this.domain;
        return new Promise((resolve, reject) => {
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
                region: qiniu.region.z0
            };
            let observer = {
                next(res) {
                },
                error(err) {
                },
                complete(res) {
                    Loading.close();
                    resolve({
                        default: domain + res.key
                    });
                }
            }
            // 上传
            let file = loader.file;
            Loading.open({ text: '上传中...' });
            let observable = qiniu.upload(file, util.common.guid(8, 16), uptoken, putExtra, config);
            // 上传开始
            observable.subscribe(observer);
        });
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }
}