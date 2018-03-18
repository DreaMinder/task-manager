import Vue from 'vue';
import Router from 'vue-router';
import { store } from './store';

import Login from '@/scenes/Login';
import NotFound from '@/scenes/NotFound';
import Settings from '@/scenes/Settings';
import Boards from '@/scenes/Boards';
import Board from '@/scenes/Board';
import Card from '@/scenes/Card';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: 'Login'
      },
      component: Login,
    },
    {
      path: '/',
      meta: {
        title: 'Boards'
      },
      component: Boards,
    },
    {
      path: '/board/:slug',
      name: 'Board',
      meta: {
        background: true
      },
      component: Board,
    },
    {
      path: '/card/:id',
      name: 'Card',
      meta: {
        background: true
      },
      component: Card,
    },
    {
      path: '/settings',
      name: 'Settings',
      meta: {
        title:  'Settings'
      },
      component: Settings,
    },
    {
      path: '*',
      meta: {
        title: 'Not Found'
      },
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if(!store.getters.isLoggedIn && to.name != 'Login')
    router.push('/login');

  if(!to.meta.background)
     store.dispatch('setBackground', null);

  if(to.meta.title){
     let lang = store.state.i18n.locale || 'en';
     store.dispatch('setTitle', Vue.i18n.translate(to.meta.title));
   }

  store.dispatch('endScroll');

  next()
});

export default router
