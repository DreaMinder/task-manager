import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';

import card from './Card';
import board from './Board';
import user from './User';

Vue.use(Vuex);

global.baseURL = 'http://hardcoded-production.url'; //TODO
if(process.env.NODE_ENV !== 'production') baseURL = 'http://localhost:3012/api';

export const request = axios.create({ baseURL });

request.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

request.interceptors.response.use(undefined, err => {
  let res = err.response;
  if (res && res.status === 401 && res.config && !res.config.__isRetryRequest) {
	   router.push('/login')
  }
})

export const store = new Vuex.Store({
  modules: {
    card,
    board,
    user
  }
})
