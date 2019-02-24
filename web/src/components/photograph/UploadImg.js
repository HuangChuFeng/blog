import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Upload, Form, Input, Select, Modal, Button, Icon } from 'antd';

class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })

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
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
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
        }
    }
    static propTypes = {
        visible: PropTypes.bool,
        visibleHandler: PropTypes.func
    }
    handleOk = (e) => {
        this.props.visibleHandler(false);
    }

    handleCancel = (e) => {
        this.props.visibleHandler(false);
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
                <PicturesWall />
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item label="类别">
                        {getFieldDecorator('category', 
                            { initialValue: categorys[0]})(
                            <Select style={{ width: 100 }} onChange={this.handleTypeChange}>
                                {categorys.map((item, i) => {
                                    return (<Option key={i} value={item}>{item}</Option>)
                                })}
                            </Select>)}
                    </Form.Item>
                    <Form.Item label="标题">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入照片标题' }],
                        })(
                            <Input placeholder="为这组照片起个名字吧" />
                            )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({ name: 'artile-form' })(UploadImg);
