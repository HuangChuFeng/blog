import React, { Component } from 'react'
import { Form, Input, Button, Icon, Upload, Tag, Select, Col, Row } from 'antd';
import PropTypes from 'prop-types'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}
// 上传文章封面
class Cover extends React.Component {
    static propTypes = {
        article: PropTypes.object,
    }
    state = {
        loading: false,
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">文章封面</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <Upload
                name="cover"
                listType="picture-card"
                className="cover-uploader"
                showUploadList={false}
                action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="cover" /> : uploadButton}
            </Upload>
        );
    }
}

// 输入表单组件
class ArticleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: this.props.article && this.props.article.tags != '' ? this.props.article.tags.split(',') : [],
            inputTag: '',
        }
    }
    static propTypes = {
        article: PropTypes.object,
        onRef: PropTypes.func,
    }

    componentDidMount() {
        this.props.onRef(this);
        this.props.article ? this.initForm() : this.props.form.setFieldsValue({ type: '0' });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    
    initForm() {
        let { type, title, description } = this.props.article;
        
        let option = {
            type,
            title,
            description,
        }
        this.props.form.setFieldsValue(option);
    }

    delTagHandler(index) {
        this.state.tagList.splice(index, 1);
    }

    tagInputChange = (e) => {
        this.setState({ inputTag: e.target.value });
    }

    addTagHandler = (e) => {
        if (e.keyCode === 13) {
            console.log('增加标签', this.state.inputTag)
            this.state.tagList.push(this.state.inputTag);
            this.setState({
                inputTag: '' 
            });
        }
    }

    handleTypeChange(value) {

    }

    getFormData = () => {
        return Object.assign({tags: this.state.tagList.join(',')}, this.props.form.getFieldsValue());
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        return (
            <Form onSubmit={this.handleSubmit} className="artile-form">
                <Row>
                    <Col span={4} >
                        <Form.Item>
                            {getFieldDecorator('type')(
                            <Select style={{ width: 100 }} onChange={this.handleTypeChange}>
                                <Option value="0">原创</Option>
                                <Option value="1">分享</Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={20} >
                        <Form.Item>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入文章标题' }],
                            })(
                                <Input placeholder="文章标题"/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入文章描述' }],
                    })(
                        <Input placeholder="描述下文章吧" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Row>
                        <Col span={3} ><Input placeholder="输入标签回车" value={this.state.inputTag} onChange={this.tagInputChange.bind(this)} onKeyDown={this.addTagHandler.bind(this)} /></Col>
                        <Col span={18} className="tag-wrap" >
                            {this.state.tagList.map((item, i) => {
                                return (<Tag key={i} closable onClose={this.delTagHandler.bind(this, i)} color="blue">{ item }</Tag>)
                            })}
                        </Col>
                        <Col span={2} ><Cover /></Col>
                    </Row>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'artile-form' })(ArticleForm);