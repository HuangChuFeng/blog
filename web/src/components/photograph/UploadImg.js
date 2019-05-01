import React, { Component } from 'react'
// import * as qiniu from 'qiniu-js'
import PropTypes from 'prop-types'
import { Upload, Form, Input, Select, Modal, Button, Icon } from 'antd';
import { getUploadToken, uploadImgs } from "../../service/fetch";

let uploadToken = '';
class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        // {
        //     uid: '-1',
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }
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

    onUploadRemove = (info) => {
        console.log(info)
        console.log(this.state.fileList)
    }

    handleChange = ({ fileList }) => {
        this.setState({ fileList })
        this.props.getUploadList(fileList.map(item => {
            return item.response;
        }))
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
                    action="https://upload.qiniup.com"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onRemove={this.onUploadRemove}
                    onChange={this.handleChange}
                    data={{token: uploadToken}}
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
            // imgList: [],
            imgList: [ { key: 'FtWEY_zIVk8uAketYiC6sQ-qRE0G',
            hash: 'FtWEY_zIVk8uAketYiC6sQ-qRE0G',
            w: 781,
            h: 1065 },
          { key: 'FtgzmMUlHqyRraiG6918LlXOpHyo',
            hash: 'FtgzmMUlHqyRraiG6918LlXOpHyo',
            w: 1000,
            h: 2805 } ]
        }
    }
    static propTypes = {
        visible: PropTypes.bool,
        visibleHandler: PropTypes.func
    }

    componentDidMount() {
        getUploadToken().then(result => {
            const {data} = result;
            if (data) {
                uploadToken = data.uploadToken;
            } 
        });
    }

    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let group = {
                    imgs: this.state.imgList,
                    info: this.props.form.getFieldsValue()
                }
                uploadImgs(group).then(result => {
                    console.log(result)
                    const {data} = result;
                    if (data.resCode === 200) {
                        this.props.visibleHandler(false);
                        this.setState({
                            imgList: []
                        })
                        this.props.form.resetFields();
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
