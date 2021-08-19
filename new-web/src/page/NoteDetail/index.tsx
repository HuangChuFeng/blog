import MarkDown from '@lib/MarkDown';
import React from 'react';

type NoteDetailState = {
    content: string;
};
export default class NoteDetail extends React.Component<any, NoteDetailState> {
    constructor(props: any) {
        super(props);
        this.state = {
            content: '',
        };
    }

    async componentDidMount(): Promise<void> {
        const url = await import('../../docs/MongoDB.md');
        const res = await fetch(url.default).then((res) => res.text());
        this.setState({ content: res });
    }

    render(): JSX.Element {
        return <MarkDown content={this.state.content} />;
    }
}
