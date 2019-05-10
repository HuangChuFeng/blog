import React, { Component } from 'react'
// import * as qiniu from 'qiniu-js'
import PropTypes from 'prop-types'
import { Upload, Form, Input, Select, Modal, Icon } from 'antd';
import {uploadImg, publishImgs } from "../../service/fetch";

class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    static propTypes = {
        getUploadList: PropTypes.func,
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    upload(data) {
        const formData = new FormData();
        formData.append(data.filename, data.file);
        const _this = this;
        this.getImgWH(data.file, function() {
            uploadImg(formData).then(res => {
                if (res.data.resCode === 200) {
                    _this.state.fileList.push({
                        name: res.data.fileName,
                        status: 'done',
                        url: res.data.url,
                        w: data.file.w,
                        h: data.file.h
                    })
                    _this.state.fileList.map((v, i) => {
                        v.uid = i;
                    })
                    _this.setState({
                        fileList: _this.state.fileList
                    })
                    _this.props.getUploadList(_this.state.fileList)
                } 
            })
        })
        // console.log('data====', data);
    }
    // handleStart
    getImgWH(file, cb) {
        // 获取图片宽高
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var image = new Image();
            image.onload = function () {
                file.w = this.width;
                file.h = this.height;
                cb();
            }
            image.src= data;
        }
        reader.readAsDataURL(file);
    }

    onUploadRemove = (info) => {
        let uid = info.uid
        this.state.fileList.forEach((item, i) => {
            if(uid === item.uid) {
                this.state.fileList.splice(i, 1);
                return false;
            }
        })
        this.setState({
            fileList: this.state.fileList
        })
        this.props.getUploadList(this.state.fileList)
    }

    handleChange = ({ fileList }) => {
        console.log('change', fileList);
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    // {...uploadProps}
                    // action="http://localhost:3000/api/imgs/upload"//"https://upload.qiniup.com"
                    listType="picture-card"
                    multiple
                    fileList={fileList}
                    customRequest={this.upload.bind(this)}
                    onPreview={this.handlePreview}
                    onRemove={this.onUploadRemove}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],
        }
    }
    static propTypes = {
        visible: PropTypes.bool,
        visibleHandler: PropTypes.func,
        onAddImg: PropTypes.func
    }

    componentDidMount() {
    }

    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let group = {
                    imgs: this.state.imgList,
                    info: this.props.form.getFieldsValue()
                }
                publishImgs(group).then(result => {
                    const { data } = result;
                    if (data.resCode === 200) {
                        this.props.visibleHandler(false);
                        this.setState({
                            imgList: []
                        })
                        this.props.form.resetFields();
                        data.imglist.forEach(img => {
                            img.title = group.info.title;
                            this.props.onAddImg(img)
                        })
                    } 
                });
            }
        });
    }

    handleCancel = (e) => {
        this.props.visibleHandler(false);
    }

    getUploadList = (list) => {
        this.setState({ imgList: list });
        console.log('接受子组件filelist', this.state.imgList);
        
    }

    render() {
        const categorys = ['建筑', '人像', '街拍', '风景', '其他'];
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        return (
            <Modal
                width="40%"
                title="上传照片"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <PicturesWall getUploadList={this.getUploadList.bind(this)}/>
                <Form layout="inline" onSubmit={this.handleOk}>
                    <Form.Item label="类别">
                        {getFieldDecorator('category', { 
                            initialValue: categorys[0]
                        })(
                            <Select style={{ width: 100 }} onChange={this.handleTypeChange}>
                                {categorys.map((item, i) => {
                                    return (<Option key={i} value={item}>{item}</Option>)
                                })}
                            </Select>)}
                    </Form.Item>
                    <Form.Item label="标题">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入照片标题' }],
                        })(<Input placeholder="为这组照片起个名字吧" />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({ name: 'artile-form' })(UploadImg);
