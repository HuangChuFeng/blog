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
        const _this = this;
        this.getNewImg(data.file, function(newFile) {
            formData.append(data.filename, newFile);
            uploadImg(formData).then(res => {
                if (res.data.resCode === 200) {
                    _this.state.fileList.push({
                        name: res.data.fileName,
                        status: 'done',
                        url: res.data.url,
                        w: newFile.w,
                        h: newFile.h
                    })
                    _this.state.fileList.forEach((v, i) => {
                        v.uid = i;
                    })
                    _this.setState({
                        fileList: _this.state.fileList
                    })
                    _this.props.getUploadList(_this.state.fileList)
                } 
            })
        })
    }
    // handleStart
    getNewImg(file, cb) {
        // 获取图片宽高
        let reader = new FileReader();
        let name = file.name;
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            let data = e.target.result;            
            let image = new Image();
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            image.onload = function () {
                // 目标尺寸
                canvas.width = this.width * 0.5;
                canvas.height = this.height * 0.5;
                // 清除画布
                context.clearRect(0, 0, canvas.width, canvas.height);
                // 图片压缩
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                let newFile = dataURLtoFile(canvas.toDataURL('image/jpeg', 0.92), name);
                newFile.w = canvas.width;
                newFile.h = canvas.height;
                newFile.uid = file.uid;
                cb(newFile);
            }
            image.src = data;
        }

        function dataURLtoFile(dataurl, filename) {
            //将base64转换为文件
            var arr = dataurl.split(","),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {
              type: mime
            });
          }
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
