import Vue from 'vue'

export const state = () => ({
	current: {}
})

export const mutations = {
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
		Vue.set(state.current.lists, index, list)
	},
	DELETE_LIST (state, id){
		let index = state.current.lists.findIndex(l => l._id === id);

		Vue.delete(state.current.lists, index);
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
		Vue.set(state.current.tables, index, table)
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

		Vue.delete(state.current.tables, index);
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
		Vue.set(state.current.notes, index, note)
	},
	DELETE_NOTE (state, noteId){
		let index = state.current.notes.findIndex(n => n._id === noteId);

		Vue.delete(state.current.notes, index);
	},
	ADD_TASK (state, {task, tableId}){
		let index = state.current.tables.findIndex(t => t._id === tableId)
		state.current.tables[index].tasks.push(task)
	},
	UPDATE_TASK (state, {task, tableId}){
		let table = state.current.tables.find(t => t._id === tableId);
		let index = table.tasks.findIndex(t => t._id === task._id)
		Vue.set(table.tasks, index, task)
	}
}

export const actions = {
	async update ({commit}, card) {
		if(card.groupId)
			commit('board/RENAME_CARD', {
				groupId: card.groupId,
				title: card.title,
				_id: card._id
			}, {root: true});

		const updated = await this.$axios.patch('/cards/' + card._id, card);
		commit('SET_CARD', updated.data);
	},
	async delete ({commit}, cardId) {
		await this.$axios.delete('/cards/' + cardId);
		commit('CLEAR_CARD')
	},
	async get ({state, commit}, cardId) {
		if(state.current._id !== cardId) commit('CLEAR_CARD');
		const card = await this.$axios.get(`/cards/${cardId}`);
		commit('SET_CARD', card.data);
		commit('SET_BG', card.data.board.image, {root: true});
	},
	async addList ({commit}, params) {
		const list = await this.$axios.post(`/lists/${params.cardId}`, {
			title: 'New list',
			tasks: [{title: 'Новое дело'}]
		});
		commit('ADD_LIST', list.data);
	},
	async updateList ({commit}, list) {
		const updated = await this.$axios.patch(`/lists/${list._id}`, list);
		commit('UPDATE_LIST', updated.data);
	},
	deleteList({commit, state, dispatch}, list) {
		commit('DELETE_LIST', list);
		dispatch('update', {
			_id: state.current._id,
			lists: state.current.lists
		})
	},
	async addTable ({commit}, {cardId}) {
		const table = await this.$axios.post(`/tables/${cardId}`, {title: 'New table'});
		commit('ADD_TABLE', table.data);
	},
	async updateTable ({commit}, table) {
		if(!table.title) table.title = 'Task table';
		const updated = await this.$axios.patch('/tables/' + table._id, table);
		commit('UPDATE_TABLE', updated.data);
	},
	sortTables ({dispatch, state, commit}, params) {
		commit('SORT_TABLES', params);
		dispatch('updateCard', {
			_id: state.current._id,
			tables: state.current.tables
		})
	},
	deleteTable({commit, state, dispatch}, table) {
		commit('DELETE_TABLE', table);
		dispatch('updateCard', {
			_id: state.current._id,
			tables: state.current.tables
		})
	},
	async addNote ({commit}, {cardId}) {
		const note = await this.$axios.post(`/notes/${cardId}`, {content: 'New note'});
		commit('ADD_NOTE', note.data);
	},
	async updateNote ({commit}, {cardId, note}) {
		const updated = await this.$axios.patch(`/notes/${cardId}/${note._id}`, note);
		commit('UPDATE_NOTE', updated.data);
		commit('END_EDIT');
	},
	deleteNote ({dispatch,commit}, note) {
		commit('DELETE_NOTE', note);
		dispatch('updateCard', {
			_id: state.current._id,
			notes: state.current.notes
		})
	},
	async addTask ({commit}, params) {
		const task = await this.$axios.post('/tasks/' + params.tableId, params.task);
		commit('ADD_TASK', {
			task: task.data,
			tableId: params.tableId
		});
	},
	async updateTask ({commit}, {task,tableId}) {
		const updated = await this.$axios.patch('/tasks/' + task._id, task);
		commit('UPDATE_TASK', {
			task: updated.data,
			tableId
		});
	}
}

export const getters = {
	card: state => state.current,
	lists: state => state.current.lists,
	isAdmin: state => state.current.userRole === 'admin',
	backLink: (state, getters, rootState) => {
		try {
			if(rootState.board.current.slug)
				return rootState.board.current.slug
			else
				return rootState.card.current.board.slug
		} catch (err) {}
	}
}
