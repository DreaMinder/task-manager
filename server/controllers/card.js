const {Board, Card, Event} = require('../models');

module.exports = {
	get: async ctx => {
		try {
			let card = await Card.findById(ctx.params.cardId)
			.populate('lists')
			.populate('users.user', '-email -password')
			.populate('notes.user', '-email -password')
			.populate('notes.comments.user', '-email -password')
			.populate({
				path:'board',
				select: '-groups -descr',
				populate: [{
					path: 'users.user',
					select: '-password -email'
				}]
			})
			.populate({
				path: 'tables',
				populate: {
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
				}
			})

			card.findRole(ctx.state.user._id);
			card = card.toObject();
			card.user = ctx.state.user._id;
			ctx.body = card

		} catch(error){
			console.error(error);
			ctx.status = 403
		}
	},
	post: async ctx => {
		try {

			ctx.body = await Card.create({
				title: ctx.request.body.title,
				board: ctx.params.boardId,
				users: [{
					user: ctx.state.user._id,
					role: 'admin'
				}]
			})

		} catch(error){
			console.error(error);
		}
	},
	patch: async ctx => {
		delete ctx.request.body._id;
		try {
			let card = await Card.findByIdAndUpdate(
					ctx.params.cardId, ctx.request.body, {new: true}
				)
			.populate('lists')
			.populate('users.user', '-email -password')
			.populate('notes.user', '-email -password')
			.populate('notes.comments.user', '-email -password')
			.populate({
				path:'board',
				select: '-groups -descr',
				populate: [{
					path: 'users.user',
					select: '-password -email'
				}]
			})
			.populate({
				path: 'tables',
				populate: {
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
				}
			})

			card.findRole(ctx.state.user._id);
			card = card.toObject();
			card.user = ctx.state.user._id;
			ctx.body = card;

			Event.create({
				user: ctx.state.user._id,
				action: 'edit_card',
				title: ctx.request.body.title,
				board: card.board._id
			})

		} catch(error){
			console.error(error);
		}
	},
	delete: async ctx => {
		try {

			ctx.body = await Card.remove({_id: ctx.params.cardId});

		} catch(error){
			console.error(error);
		}
	},
	search: async ctx => {
		try {

			ctx.body = await Card.find({
				title: {
					$regex: ctx.request.query.search,
					$options: "i"
				},
				'users.user': ctx.state.user._id
			}).select('_id title')

		} catch(error){
			console.error(error);
		}
	},
};
