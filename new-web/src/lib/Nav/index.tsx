import React from 'react';
import { Link } from 'react-router-dom';
import './Index.scss';

export default class Nav extends React.Component {
    render(): JSX.Element {
        return (
            <div className="nav">
                <Link to="/photograph">摄影</Link>
                <Link to="/notes">笔记</Link>
            </div>
        );
    }
}
