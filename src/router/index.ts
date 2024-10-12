import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue'),
  },
  {
    path: '/leaderboard/:type?',
    name: 'Leaderboard',
    component: () => import('../views/leaderboard.vue'),
    alias: '/loserboard/:type?',
  },
  {
    path: '/channel/:username',
    name: 'Channel',
    component: () => import('../views/channel.vue'),
  },
  {
    path: '/help/:command?',
    name: 'Help',
    component: () => import('../views/help.vue'),
  },
  {
    path: '/redirects',
    name: 'Redirects',
    component: () => import('../views/redirects.vue'),
  },
  {
    path: '/api/docs',
    name: 'API Docs',
    component: () => import('../views/docs.vue'),
  },
  {
    path: '/emotes/history/:username',
    name: 'History',
    component: () => import('../views/emoteHistory.vue'),
  },
  {
    path: '/connections',
    name: 'Connections',
    component: () => import('../views/connections.vue'),
  },
  {
    path: '/emotes/search',
    name: 'Search',
    component: () => import('../views/emoteSearch.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
