import { request } from './'

const state = {
  list: [],
  current: {}
}

const mutations = {
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
    state.current.groups.splice(index, 1);
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

const actions = {
	addBoard: async ({commit, dispatch}, boardData) => {
		try{

      commit('START_PRELOAD');
			const board = await request.post("/boards", boardData);
			commit('ADD_BOARD', board.data);
      commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
  getBoards: async ({commit, dispatch}) => {
		try{

      commit('START_PRELOAD');
			const boards = await request.get("/boards");
			commit('SET_BOARDS', boards.data);
      commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
	getBoard: async ({state, commit, dispatch}, slug) => {
		try{

      commit('START_PRELOAD');
      if(state.current.slug !== slug)
        commit('CLEAR_BOARD');
			const board = await request.get("/boards/" + slug);
			commit('SET_BOARD', board.data);
      commit('SET_TITLE', board.data.title);
      commit('SET_BG', board.data.image);
      commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
	updateBoard: async ({commit, dispatch}, board) => {
		try{

      commit('START_PRELOAD');
			const updated = await request.patch("/boards/" + board._id, board);
			commit('SET_BOARD', updated.data);
      commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
	deleteBoard: async ({commit, dispatch}, board) => {
		try{

			await request.delete("/boards/" + board)
      dispatch('getBoards');
      commit('CLEAR_BOARD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
  renameGroup: ({commit, dispatch}, group) => {
    try {

      commit('RENAME_GROUP', group);
      dispatch('updateBoard', {
        _id: state.current._id,
        groups: state.current.groups
      })

    } catch(error) { 	dispatch('handleError',error)	}
  },
	deleteGroup: ({commit, dispatch}, group) => {
		commit('DELETE_GROUP', group);
    dispatch('updateBoard', {
      _id: state.current._id,
      groups: state.current.groups
    })
	},
	addGroup: ({commit, dispatch}, group) => {
		commit('ADD_GROUP', group);
	},
  leaveBoard: async ({commit, dispatch}, boardId) => {
    try{

  		await request.patch(`/boards/${boardId}/leave`);
      commit('CLEAR_BOARD');

    } catch(error) { 	dispatch('handleError',error)	}
	},
	insertCard: ({commit, dispatch}, params) => {
		try{

      params.card = {_id: params.cardId};
      params.editable = false;
      commit('ADD_CARD', params);

      dispatch('updateBoard', {
        _id: params.boardId,
        groups: state.current.groups
      })

		} catch(error) { 	dispatch('handleError',error)	}
	},
	addCard: async ({commit, dispatch}, params) => {
		try{

			const card = await request.post(`/cards/${params.boardId}`);
			params.card = card.data;
      params.editable = true;
			commit('ADD_CARD', params);

		} catch(error) { 	dispatch('handleError',error)	}
	}
}

const getters = {
	boards: state => state.list,
  board: state => state.current,
  boardTags: state => state.current.tags,
  isAdmin: state => state.current.userRole === 'admin',
	boardLink: state => state.card && state.card.board && state.card.board.slug,
}

export default {
	state,
	getters,
	actions,
	mutations
}
