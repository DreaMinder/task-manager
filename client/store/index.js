export const state = () => ({
  locale: 'en',
  editable: false,
  scrolled: false,
  error: false,
  background: null
})

export const mutations = {
  SCROLLED(state, status) {
    state.scrolled = status
  },
  SET_BG (state, bg){
    state.background = bg || 'default'
  },
  SET_LANG(state, locale) {
    state.locale = locale
    localStorage.setItem('locale', locale)
  }
}

export const actions = {
  async invite({commit}, { email, message }){
    await this.$axios.post("/auth/invite/" + email);
  },
  async updateUser({commit}, user){
    const updated = await this.$axios.put('/account', user);
  }
}

export const getters = {
  scrolled: state => state.scrolled,
  background: state => state.background,
  error: state=> state.error
}
