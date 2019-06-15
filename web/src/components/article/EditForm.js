import React from 'react'
import { Form, Input, Icon, Upload, Select, Col, Row } from 'antd';
import PropTypes from 'prop-types'

// 输入表单组件
class ArticleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTags: [],
            loading: false, // 上传封面loading
            coverUrl: '',   // 封面url
            coverName: '',  // 封面名称
        }
    }
    static propTypes = {
        article: PropTypes.object,
        onRef: PropTypes.func,
        uploadCover: PropTypes.func
    }
    componentDidMount() {
        this.props.onRef(this);
        this.props.form.setFieldsValue({ type: 0 })
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.article && !this.props.article) {
            this.initForm(nextProps.article)
        }
    }

    initForm(article) {
        let { type, title, description } = article;
        let option = {
            type,
            title,
            description,
        }
        this.setState({
            coverUrl: article.cover_url,
            selectedTags: article.tags.map(item => {
                return item.name
            })
        })
        this.props.form.setFieldsValue(option);

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

    onUploadCover(data) {
        this.setState({ loading: true });
        this.props.uploadCover(data, (res) => {
            if(res.data.resCode === 200) {
                this.setState({
                    coverUrl: res.data.url,
                    loading: false,
                    coverName: res.data.fileName
                })
            }
        })
    }

    getFormData = () => {
        let res;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                res = Object.assign(
                    { 
                        tags: this.state.selectedTags,
                        coverName: this.state.coverName,
                        coverUrl: this.state.coverUrl
                    }, 
                    this.props.form.getFieldsValue()
                );
            }
        });
        return res;
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">文章封面</div>
            </div>
        );
        const Option = Select.Option;
        const { getFieldDecorator } = this.props.form;
        const selects = [];
        if (this.props.allTags) {
            for (let i = 0; i < this.props.allTags.length; i++) {
                selects.push(<Option key={this.props.allTags[i].name} value={this.props.allTags[i].name}>{this.props.allTags[i].name}</Option>);
            }
        }

        return (
            <Form onSubmit={this.handleSubmit} className="artile-form">
                <Row>
                    <Col span={4} >
                        <Form.Item>
                            {getFieldDecorator('type')(
                                <Select style={{ width: 100 }}>
                                    <Option value={0}>笔记</Option>
                                    <Option value={1}>生活</Option>
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={20} >
                        <Form.Item>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入文章标题' }],
                            })(
                                <Input placeholder="文章标题" />
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
                                placeholder='选择标签'
                                value={this.state.selectedTags}
                                onChange={this.handleTagChange.bind(this)}
                                style={{ width: '100%' }}
                            >
                                {selects}
                            </Select>
                        </Col>
                        <Col span={2} ></Col>
                        <Col span={2} >
                        <Upload
                            listType="picture-card"
                            className="cover-uploader"
                            customRequest={this.onUploadCover.bind(this)}
                            showUploadList={false}
                        >
                            {this.state.coverUrl ? <img src={this.state.coverUrl} alt="cover" /> : uploadButton}
                        </Upload>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'artile-form' })(ArticleForm);