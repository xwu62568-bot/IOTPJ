import { createBrowserRouter, createHashRouter } from 'react-router';
import { Layout } from './components/layout';
import { HomePage } from './components/home-page';
import { ZonesPage } from './components/zones-page';
import { MessagesPage } from './components/messages-page';
import { SettingsPage } from './components/settings-page';
import { ProjectDetail } from './components/project-detail';
import { CreateProject } from './components/create-project';
import { CreateZone } from './components/create-zone';

const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'zones', Component: ZonesPage },
      { path: 'messages', Component: MessagesPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  { path: '/project/:id', Component: ProjectDetail },
  { path: '/create-project', Component: CreateProject },
  { path: '/create-zone', Component: CreateZone },
];

const useHashRouter = import.meta.env.VITE_DEPLOY_TARGET === 'github-pages';

export const router = useHashRouter ? createHashRouter(routes) : createBrowserRouter(routes);
