import Vue from 'vue'
import { request } from './'

const state = {
	current: {}
}

const mutations = {
	CLEAR_CARD (state){
		state.current = {}
	},
	SET_CARD (state, card){
		card.editable = false
		state.current = card
	},
	ADD_TAG (state, tag){
		if(state.current.board)
			state.current.board.tags.push(tag)
	},
	ADD_LIST (state, list){
		state.current.lists.push({
			title: '',
			_id: list._id,
			tasks: list.tasks,
			editable: true
		})
	},
	UPDATE_LIST (state, list){
		let index = state.current.lists.findIndex(l => l._id === list._id);
		state.current.lists.splice(index, 1, list)
	},
	DELETE_LIST (state, id){
		let index = state.current.lists.findIndex(l => l._id === id);
		state.current.lists.splice(index, 1);
	},
	ADD_TABLE (state, table){
		state.current.tables.unshift({
			title: '',
			_id: table._id,
			tasks: [],
			editable: true
		})
	},
	UPDATE_TABLE (state, table){
		let index = state.current.tables.findIndex(t => t._id === table._id);
		state.current.tables.splice(index, 1, table)
	},
	SORT_TABLES (state, params){
		let indexFrom = state.current.tables.findIndex(t => t._id === params.tableId)
		let indexTo = null;
		if(params.up && state.current.tables[indexFrom-1])
			indexTo = indexFrom-1;
		else if(params.down && state.current.tables[indexFrom+1])
			indexTo = indexFrom+1;

		if(indexTo != null){
			let buf = state.current.tables[indexTo]
			Vue.set(state.current.tables, indexTo, state.current.tables[indexFrom])
			Vue.set(state.current.tables, indexFrom, buf)
		}
	},
	DELETE_TABLE (state, id){
		let index = state.current.tables.findIndex(t => t._id === id)
	  state.current.tables.splice(index, 1);
	},
	ADD_NOTE (state, note){
		state.current.notes.unshift({
			content: '',
			user: note.user,
			_id: note._id,
			comments: [],
			editable: true
		})
	},
	UPDATE_NOTE (state, note){
		let index = state.current.notes.findIndex(n => n._id === note._id);
		state.current.notes.splice(index, 1, note)
	},
	DELETE_NOTE (state, noteId){
		let index = state.current.notes.findIndex(n => n._id === noteId);
		state.current.notes.splice(index, 1);
	},
	ADD_TASK (state, {task, tableId}){
		let index = state.current.tables.findIndex(t => t._id === tableId)
		state.current.tables[index].tasks.push(task)
	},
	UPDATE_TASK (state, {task, tableId}){
		let table = state.current.tables.find(t => t._id === tableId);
		let index = table.tasks.findIndex(t => t._id === task._id)
		table.tasks.splice(index, 1, task)
	}
}

const actions = {
	updateCard: async ({commit, dispatch}, card) => {
    try{

			commit('START_PRELOAD')
			if(card.groupId)
				commit('RENAME_CARD', {
					groupId: card.groupId,
					title: card.title,
					_id: card._id
				});

			const updated = await request.patch("/cards/" + card._id, card);
			commit('SET_CARD', updated.data);
			commit('END_PRELOAD')

		} catch(error) { dispatch('handleError',error) }
	},
	deleteCard: async ({commit, dispatch}, cardId) => {
    try {

			await request.delete("/cards/" + cardId);
			commit('CLEAR_CARD')

		} catch(error) { dispatch('handleError',error) }
	},
	getCard: async ({state, commit, dispatch}, cardId) => {
		try {

			commit('START_PRELOAD')
			if(state.current._id !== cardId) commit('CLEAR_CARD');
			const card = await request.get("/cards/" + cardId);
			commit('SET_CARD', card.data);
			commit('SET_TITLE', card.data.title);
			commit('SET_BG', card.data.board.image);
			commit('END_PRELOAD')

		} catch(error) { 	dispatch('handleError',error)	}
	},
	addList: async ({commit, dispatch}, params) => {
		try {

			const list = await request.post(`/lists/${params.cardId}`, {
				title: 'New list',
				tasks: [{title: 'Новое дело'}]
			});
			commit('ADD_LIST', list.data);

		} catch(error) { 	dispatch('handleError',error)	}
	},
	updateList: async ({commit, dispatch}, list) => {
		try {

			commit('START_PRELOAD')
			if(list.title === '') list.title = 'List';
			const updated = await request.patch("/lists/" + list._id, list);
			commit('UPDATE_LIST', updated.data);
			commit('END_PRELOAD')

		} catch(error) { 	dispatch('handleError',error)	}
	},
	deleteList: ({commit, dispatch}, list) => {
		commit('DELETE_LIST', list);
		dispatch('updateCard', {
			_id: state.current._id,
			lists: state.current.lists
		})
	},
	addTable: async ({commit, dispatch}, {cardId}) => {
		try {

			const table = await request.post("/tables/" + cardId, {title: 'New table'});
			commit('ADD_TABLE', table.data);

		} catch(error) { 	dispatch('handleError',error)	}
	},
	updateTable: async ({commit, dispatch}, table) => {
		try {

			commit('START_PRELOAD')
			if(!table.title) table.title = 'Task table';
			const updated = await request.patch("/tables/" + table._id, table);
			commit('UPDATE_TABLE', updated.data);
			commit('END_PRELOAD')

		} catch(error) { 	dispatch('handleError',error)	}
	},
	sortTables: ({dispatch, commit}, params) => {
		commit('SORT_TABLES', params);
		dispatch('updateCard', {
			_id: state.current._id,
			tables: state.current.tables
		})
	},
	deleteTable: ({commit, dispatch}, table) => {
		commit('DELETE_TABLE', table);
		dispatch('updateCard', {
			_id: state.current._id,
			tables: state.current.tables
		})
	},
	addNote: async ({commit, dispatch}, {cardId}) => {
		try{

			const note = await request.post(`/notes/${cardId}`, {content: 'New note'});
			commit('ADD_NOTE', note.data);

		} catch(error) { 	dispatch('handleError',error)	}
	},
	updateNote: async ({commit, dispatch}, {cardId, note}) => {
		try{

			commit('START_PRELOAD')
			const updated = await request.patch(`/notes/${cardId}/${note._id}`, note);
			commit('UPDATE_NOTE', updated.data);
			commit('END_EDIT');
			commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
	deleteNote: ({dispatch,commit}, note) => {
		commit('DELETE_NOTE', note);
		dispatch('updateCard', {
			_id: state.current._id,
			notes: state.current.notes
		})
	},
	addTask: async ({commit, dispatch}, params) => {
		try{

			commit('START_PRELOAD')
			const task = await request.post("/tasks/" + params.tableId, params.task);
			commit('ADD_TASK', {
				task: task.data,
				tableId: params.tableId
			});
			commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	},
	updateTask: async ({commit, dispatch}, {task,tableId}) => {
		try {

			commit('START_PRELOAD')
			const updated = await request.patch("/tasks/" + task._id, task);
			commit('UPDATE_TASK', {
				task: updated.data,
				tableId
			});
			commit('END_PRELOAD');

		} catch(error) { 	dispatch('handleError',error)	}
	}
}

const getters = {
	card: state => state.current,
	lists: state => state.current.lists,
	isCardAdmin: state => state.current.userRole === 'admin',
	backLink: (state, getters, rootState) => {
		try {
			if(rootState.board.current.slug)
				return rootState.board.current.slug
			else
				return rootState.card.current.board.slug
		} catch (err) {}
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
