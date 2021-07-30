import Home from '@page/Home/Index';
import NoteDetail from '@page/NoteDetail';
import NoteList from '@page/NoteList';
import React from 'react';

export interface RouteItem {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
}

export const routes: RouteItem[] = [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/notes',
        component: NoteList,
        exact: true,
    },
    {
        path: '/notes/:id',
        component: NoteDetail,
        exact: true,
    },
];
