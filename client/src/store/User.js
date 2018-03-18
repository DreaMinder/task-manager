import { request } from './'
import Vue from 'vue'

const state = {
  isPreloading: true,
  editable: false,
  scrolled: false,
  current: null,
  error: false,
  background: null,
  token: localStorage.getItem('token')
}

const mutations = {
  SOCKET_CONNECT: (state, status) => {
    state.isPreloading = false
  },
  SOCKET_DISCONNECT: (state, status) => {
    state.isPreloading = true
  },
  LOGIN_SUCCESS(state, token) {
    state.token = token;
    request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  SCROLLED(state, status) {
    state.scrolled = status
  },
  LOGOUT(state) {
    state.token = false;
    state.current = null
  },
  START_EDIT(state) {
    state.editable = true
  },
  END_EDIT(state) {
    state.editable = false
  },
  START_PRELOAD(state) {
    state.isPreloading = true
  },
  END_PRELOAD(state) {
    setTimeout(() => {
      state.isPreloading = false
    },200)
  },
  SET_TITLE(state, title) {
    state.title = title;
    document.title = (title.slice(0,40) || '') + ' :: Task Manager';
  },
  SET_BG (state, bg){
    state.background = bg || 'default'
  },
  SET_USER(state, user) {
    state.current = user
  }
}

const actions = {
  startEdit: ({commit}) => commit('START_EDIT'),
  endEdit: ({commit}) => commit('END_EDIT'),
  startPreload: ({commit}) => commit('START_PRELOAD'),
  endPreload: ({commit}) => commit('END_PRELOAD'),
  setTitle: ({commit}, title) => commit('SET_TITLE', title),
  setBackground: ({commit}, bg) => commit('SET_BG', bg),
  startScroll: ({commit}) => commit('SCROLLED', true),
  endScroll: ({commit}) => commit('SCROLLED', false),
  login: async({commit, dispatch}, creds) => {
    try {

      commit('START_PRELOAD')
      const JWT = await request.post("/auth/login", creds);
      localStorage.setItem('token', JWT.data.token);
      commit('LOGIN_SUCCESS', JWT.data.token);

    } catch (error) {throw error }
  },
  logout: ({commit}) => {
    localStorage.removeItem("token");
    commit('LOGOUT');
  },
  invite: async({commit, dispatch}, { email, message }) => {
    try {

      commit('START_PRELOAD')
      await request.post("/auth/invite/" + email);
      dispatch('handleError',new Error(message))
      commit('END_PRELOAD')

    } catch(error) { dispatch('handleError',error) }
  },
  getUser: async({commit, dispatch}) => {
    try {

      const user = await request.get("/account");
      commit('SET_USER', user.data);
      commit('END_PRELOAD')

    } catch(error) { dispatch('handleError',error) }
  },
  updateUser: async({commit, dispatch}, user) => {
    try {

      commit('START_PRELOAD')
      const updated = await request.put("/account", user);
      commit('SET_USER', updated.data);
      commit('END_PRELOAD')

    } catch(error) { dispatch('handleError',error) }
  },
  handleError: async({commit, dispatch}, error) => {

    if(error.message !== 'Nothing changed') {
      console.error(error);

      let message = error.message || 'Error';

	  if(error.message && error.message == "Cannot read property 'data' of undefined")
        message = 'Error FTW'; //TODO
	  else if(error.response){
		    message = error.response.data;

		if(typeof error.response === 'string' && error.response.includes('No matching'))
			message = 'VersionError';
	  }

      Vue.toasted.show(message || error.message, {
        icon: 'error',
        duration: 4000,
        position: 'top-center'
      });
    }
    commit('END_PRELOAD');

  },
}

const getters = {
  isLoggedIn: state => !!state.token,
  token: state => state.token,
  isPreloading: state => state.isPreloading,
  editable: state => state.editable,
  scrolled: state => state.scrolled,
  user: state => state.current,
  background: state => state.background,
  error: state=> state.error,
  title: state => state.title,
}

export default {
  state,
  getters,
  actions,
  mutations
}
