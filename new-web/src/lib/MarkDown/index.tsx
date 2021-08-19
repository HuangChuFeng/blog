import React from 'react';
import ReactMarkdown from 'react-markdown';
import { pojoaque } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import gfm from 'remark-gfm';

type MarkDownProps = {
    content: string;
};

const components = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <SyntaxHighlighter
                style={pojoaque}
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                {...props}
            />
        ) : (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};
export default class MarkDown extends React.PureComponent<MarkDownProps> {
    render(): JSX.Element {
        return <ReactMarkdown remarkPlugins={[gfm]} components={components} children={this.props.content} />;
    }
}
