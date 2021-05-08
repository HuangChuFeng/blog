import Home from './page/Home/Index';

export interface RouteItem {
  path: string;
  component: any;
}

export const routes: RouteItem[] = [
  {
    path: '',
    component: Home,
  },
];
