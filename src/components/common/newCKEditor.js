import React, { Component } from 'react';
import "./newCKEditor.css";
import PropTypes from 'prop-types';
import util from '../../services/Util';
import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import * as qiniu from 'qiniu-js';
import { Menu } from 'antd';
import Loading from './Loading';
const { SubMenu } = Menu;

let domain;
let uptoken;

class MyCKEditor extends Component {
	constructor(props) {
		super(props);
		domain = props.domain;
		uptoken = props.uptoken;
		this.state = {
			typeArr: [],
		}
		this.createMenu = this.createMenu.bind(this);
		this.recursionMenu = this.recursionMenu.bind(this);
	}
	myCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			return new MyUploadAdapter(loader, domain, uptoken);
		};
	}
	clickEditor(type, index) {
		// let editorBody = document.getElementsByTagName('body')[0]
		let editor = document.getElementsByClassName(
			"ck-editor__editable_inline"
		)[0];
		let target = editor.getElementsByTagName(type)[index];

		if (util.common.isMobile()) {
			if (document.body.scrollTop !== 0) {
				document.body.scrollTop = target.offsetTop;
			} else {
				document.documentElement.scrollTop = target.offsetTop;
			}
		} else {
			editor.scrollTop = target.offsetTop - editor.offsetTop;
		}

		let range = document.createRange();
		range.selectNodeContents(target);
		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
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
		let submenuIndex = 0;
		let submenuItemIndex = 0;
		while (node !== null) {
			if (node.innerText.trim() !== "") {
				if (node.tagName === "H2") {
					typeArr.push({
						name: node.innerText,
						submenuItem: [],
						num: h1Num,
						type: "h2"
					});
					h1Num = h1Num + 1;
					submenuIndex = typeArr.length - 1;
				}
				if (node.tagName === "H3") {
					if (!typeArr[submenuIndex]) {
						typeArr[submenuIndex] = {
							name: "",
							submenuItem: [],
							num: h1Num,
							type: "h2"
						};
					}
					typeArr[submenuIndex].submenuItem.push({
						name: node.innerText,
						submenuItem: [],
						num: h2Num,
						type: "h3"
					});
					h2Num = h2Num + 1;
					submenuItemIndex =
						typeArr[submenuIndex].submenuItem.length - 1;
				}
				if (node.tagName === "H4") {
					if (!typeArr[submenuIndex]) {
						typeArr[submenuIndex] = {
							name: "",
							submenuItem: [],
							num: h1Num,
							type: "h2"
						};
					}

					if (typeArr[submenuIndex].submenuItem.length === 0) {
						typeArr[submenuIndex].submenuItem[submenuItemIndex] = {
							name: "",
							submenuItem: [],
							num: h2Num,
							type: "h3"
						};
					}
					typeArr[submenuIndex].submenuItem[
						submenuItemIndex
					].submenuItem.push({
						name: node.innerText,
						num: h3Num,
						type: "h4"
					});
					h3Num = h3Num + 1;
				}
			}
			node = walker.nextNode();
		}
		this.setState({
			typeArr: typeArr
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

	render() {
		const { onInit, data, onChange, disabled, locale, height, } = this.props;
		const { typeArr } = this.state;

		let language = 'en';
		switch (locale) {
			case 'zh': language = 'zh-cn'; break;
			default: language = 'en';
		}
		let that = this;

		let subs = [];
		for (let i = 0; i < typeArr.length; i++) {
			subs.push(`sub-${i}`);
		}

		return (
			<div className="editor" id="editor">
				{typeArr.length !== 0 ? (
					<Menu
						style={{
							height: height,
							overflowY: 'auto',
							overflowX: 'hidden',
						}}
						mode="inline"
						inlineCollapsed={false}
						defaultOpenKeys={subs}
					>
						{this.recursionMenu(typeArr)}
					</Menu>
				) : <span className="no-menu">暂无目录...</span>}

				<div
					className={`my-ckeditor ${disabled ? 'disabled' : ''}`}
					style={{
						height: util.common.isMobile() ? 'unset' : height
					}}>
					<CKEditor
						editor={DecoupledEditor}
						data={data ? data : ''}
						config={{
							extraPlugins: [this.myCustomUploadAdapterPlugin],
							language: language,
						}}
						disabled={disabled}
						onInit={editor => {
							// Insert the toolbar before the editable area.
							if (!disabled) {
								editor.ui.getEditableElement().parentElement.insertBefore(
									editor.ui.view.toolbar.element,
									editor.ui.getEditableElement()
								);
							}

							if (onInit) onInit(editor);
						}}
						onChange={(event, editor) => {
							const data = editor.getData();
							// console.log({ event, editor, data });
							if (onChange) {
								onChange();
							}
							that.createMenu(data);
						}}
						// onBlur={editor => {
						//     console.log('Blur.', editor);
						// }}
						// onFocus={editor => {
						//     console.log('Focus.', editor);
						// }}
						onError={error => {
							console.error(error);
						}}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.createMenu(this.props.data);
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
			if (file.size > 2000000) {
				reject(`请选择小于${2000000 / 1000000}MB的图片`);
				return;
			}
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