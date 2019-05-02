import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Tag, Input, Icon,
} from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

export default class EditTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVisible: false,
            inputValue: '',
        }
    }
    
    static propTypes = {
        tags: PropTypes.array,
        initTags: PropTypes.func,
        addTag: PropTypes.func,
        deleteTag: PropTypes.func,
        isAdmin: PropTypes.bool,
        clickTagHandler: PropTypes.func
    };

    handleClose = (removedTag) => {
        // const tags = this.props.tags.filter(tag => tag !== removedTag);
        let tagIndex = 0;
        try {
            this.props.tags.forEach((item, index) => {
                if(item._id === removedTag._id) {
                    tagIndex = index;
                    return false;
                }
            })
        } catch(e) {
            throw new Error('current deleted tag_id is not exist');
        }
        this.props.deleteTag(removedTag._id, tagIndex);
        // this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    clickTagHandler(tag) {
        this.props.clickTagHandler(tag);
    }

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        this.props.addTag(inputValue);
        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input

    forMap = (tag) => {
        const tagElem = (
            <Tag
                closable={this.props.isAdmin ? true : false}
                onClose={(e) => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                <span onClick={this.clickTagHandler.bind(this, tag.name)}>{tag.name}</span>
            </Tag>
        );
        return (
            <span key={tag._id} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    }

    render() {
        const { inputVisible, inputValue } = this.state;
        let tags = this.props.tags || [];
        
        const tagChild = tags.map(this.forMap);
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8, opacity: 0, type: 'from', duration: 100,
                            onComplete: (e) => {
                                e.target.style = '';
                            },
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                    >
                        {tagChild}
                    </TweenOneGroup>
                </div>
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && this.props.isAdmin && (
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="plus" /> New Tag
                    </Tag>
                )}
            </div>
        );
    }
}