import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import Leaderboard from '../views/leaderboard.vue';
import Channel from '../views/channel.vue';
import Help from '../views/help.vue';

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    name: 'Home',
    component: Home 
  },
  { 
    path: '/leaderboard', 
    name: 'Leaderboard',
    component: Leaderboard 
  },
  {
    path: '/channel/:username',
    name: 'Channel',
    component: Channel
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;