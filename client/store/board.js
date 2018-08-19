import Vue from 'vue'

export const state = () => ({
  list: [],
  current: {}
})

export const mutations = {
	ADD_BOARD (state, board){
		state.list.push(board)
	},
	CLEAR_BOARD (state){
		state.current = {}
	},
	SET_BOARDS (state, boards){
		state.list = boards
	},
	SET_BOARD (state, board){
		state.current = board
	},
  SET_GROUPS (state, groups){
		state.current.groups = groups
	},
  SET_CARDS (state, {groupId, cards}){
		let groupState = state.current.groups.find(g => g._id === groupId);
    groupState.cards = cards
	},
	ADD_GROUP (state, group){
		state.current.groups.push(group)
	},
  RENAME_GROUP (state, {_id, title}){
    let groupState = state.current.groups.find(g => g._id === _id);
    if(groupState.title === title)
      throw new Error('Nothing changed')
    else
      groupState.title = title;
	},
	DELETE_GROUP (state, groupId){
    let index = state.current.groups.findIndex(g => g._id === groupId)

    Vue.delete(state.current.groups, index);
	},
	ADD_CARD (state, {positionId, card, groupId, editable}){
    let group = state.current.groups.find(g => g._id === groupId)
    let newCard = {
      ...card,
      editable,
      newCard: true
    }
    let cardIndex = -1;
    if(positionId) cardIndex = group.cards.findIndex(c => c._id === positionId);
    if(cardIndex > -1)
      group.cards.splice(cardIndex+1, 0, newCard)
    else
      group.cards.push(newCard);
	},
  RENAME_CARD (state, {groupId, title, _id}){
    let group = state.current.groups.find(g => g._id === groupId);
    let card = group.cards.find(c => c._id === _id);

    if(card.title === title)
      throw new Error('Nothing changed')
    else
      card.title = title;
    card.editable = false;
  },
}

export const actions = {
	async addBoard ({commit}, data){
		const board = await this.$axios.post('/boards', data);
		commit('ADD_BOARD', board.data);
	},
  async getBoards ({commit}){
		const boards = await this.$axios('/boards');
		commit('SET_BOARDS', boards.data);
	},
	async getBoard ({state, commit}, slug) {
    if(state.current.slug !== slug) commit('CLEAR_BOARD');
		const board = await this.$axios.get('/boards/' + slug);
		commit('SET_BOARD', board.data);
    commit('SET_BG', board.data.image, {root: true});
	},
	async updateBoard ({commit}, board) {
		let updated = await this.$axios.patch('/boards/' + board._id, board);
		commit('SET_BOARD', updated.data);
	},
	async deleteBoard ({commit, dispatch}, id) {
		await this.$axios.delete('/boards/' + id)
    dispatch('getBoards');
    commit('CLEAR_BOARD');
	},
  renameGroup: ({commit, state, dispatch}, group) => {
    commit('RENAME_GROUP', group);
    dispatch('updateBoard', {
      _id: state.current._id,
      groups: state.current.groups
    })
  },
	deleteGroup({commit, state, dispatch}, group) {
		commit('DELETE_GROUP', group);
    dispatch('updateBoard', {
      _id: state.current._id,
      groups: state.current.groups
    })
	},
  async leaveBoard ({commit}, boardId) {
		await this.$axios.patch(`/boards/${boardId}/leave`);
    commit('CLEAR_BOARD');
	},
	insertCard({commit, dispatch}, params){
    params.card = {_id: params.cardId};
    params.editable = false;
    commit('ADD_CARD', params);

    dispatch('updateBoard', {
      _id: params.boardId,
      groups: state.current.groups
    })
	},
	async addCard ({commit}, params) {
		const card = await this.$axios.post(`/cards/${params.boardId}`);
		params.card = card.data;
    params.editable = true;
		commit('ADD_CARD', params);
	}
}

export const getters = {
	boards: state => state.list,
  board: state => state.current,
  tags: state => state.current.tags,
  isAdmin: state => state.current.userRole === 'admin',
	boardLink: state => state.card && state.card.board && state.card.board.slug,
}
