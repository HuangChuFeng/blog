import React from 'react';
import ReactMarkdown from 'react-markdown';
import { pojoaque } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import gfm from 'remark-gfm';

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

// Did you know you can use tildes instead of backticks for code in markdown? ✨
const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~~strikethrough~~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done



~~~js
class Test {

}
~~~
`;
export default class MarkDown extends React.PureComponent {
    render(): JSX.Element {
        return <ReactMarkdown remarkPlugins={[gfm]} components={components} children={markdown} />;
    }
}
