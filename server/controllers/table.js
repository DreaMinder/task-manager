const { Table, Card, Event } = require('../models');

module.exports = {
	post: async ctx => {
		const card = await Card.findOne({
			_id: ctx.params.cardId
		});

		const table = await Table.create({
			title: ctx.request.body.title,
			card: card._id,
			tasks: []
		});

		ctx.body = table;

		card.tables.unshift(table._id);
		card.save();
	},
	patch: async ctx => {
		delete ctx.request.body._id;
		delete ctx.request.body.__v;

		let table = await Table.findByIdAndUpdate(
			ctx.params.tableId, ctx.request.body, {new: true}
		).populate( {
			path: 'tasks',
			model: 'tasks',
			populate: [{
				path: 'manager',
				model: 'users',
				select: '-password -email'
			},{
				path: 'subscribers',
				model: 'users',
				select: '-password -email'
			}]
		});

		ctx.body = table;

		Event.create({
			user: ctx.state.user._id,
			action: (table.__v === 1)? 'new_table' : 'table_edited',
			card: table.card,
			title: table.title
		})
	}
};
