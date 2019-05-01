import React, { Component } from 'react'
import { Form, Input, Icon, Upload, Select, Col, Row } from 'antd';
import PropTypes from 'prop-types'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        // message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        // message.error('Image must smaller than 2MB!');
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
            selectedTags: [],
        }
    }
    static propTypes = {
        article: PropTypes.object,
        onRef: PropTypes.func,
    }
    componentDidMount() {
        this.props.onRef(this);
        this.props.form.setFieldsValue({ type: 0 })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.article && !this.props.article) {
            nextProps.article ? this.initForm(nextProps.article) : this.props.form.setFieldsValue({ type: 0 });
            this.setState({
                // allTags: nextProps.tags
            })
        }
    }

    initForm(article) {
        let { type, title, description } = article;
        
        let option = {
            type,
            title,
            description,
        }
        this.props.form.setFieldsValue(option);
        this.setState({
            selectedTags: article.tags.map(item => {
                return item.name
            })
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleTagChange(value) {
        this.setState({ selectedTags: value })
    }

    handleTypeChange(value) {

    }

    getFormData = () => {
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         console.log('Received values of form: ', values);
        //     }
        // });
        return Object.assign({tags: this.state.selectedTags}, this.props.form.getFieldsValue());
    }

    render() {
        const Option = Select.Option;
        const { getFieldDecorator } = this.props.form;
        const selects = [];
        if(this.props.tags) {
            for (let i = 0; i < this.props.tags.length; i++) {
                selects.push(<Option key={ this.props.tags[i].name }>{ this.props.tags[i].name }</Option>);
            }
        }
        
        return (
            <Form onSubmit={this.handleSubmit} className="artile-form">
                <Row>
                    <Col span={4} >
                        <Form.Item>
                            {getFieldDecorator('type')(
                            <Select style={{ width: 100 }} onChange={this.handleTypeChange}>
                                <Option value={0}>原创</Option>
                                <Option value={1}>分享</Option>
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
                        <Col span={18} >
                            <Select
                                mode="tags"
                                placeholder="选择标签"
                                defaultValue={this.state.selectedTags}
                                onChange={this.handleTagChange.bind(this)}
                                style={{ width: '100%' }}
                                >
                                {selects}
                            </Select>
                        </Col>
                        <Col span={2} ></Col>
                        <Col span={2} ><Cover /></Col>
                    </Row>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'artile-form' })(ArticleForm);