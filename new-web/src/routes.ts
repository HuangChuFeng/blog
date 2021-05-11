import Home from './page/Home/Index';
import React from 'react';

export interface RouteItem {
  path: string;
  component: React.ComponentType<any>;
}

export const routes: RouteItem[] = [
  {
    path: '',
    component: Home,
  },
];
