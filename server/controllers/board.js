const { Board, Card } = require('../models');
const ObjectId = require('mongoose').Schema;

module.exports = {
	query: async ctx => {
		let boards = await Board.find({
				'users.user': ctx.state.user._id
		})
		.select('-groups -tags')
		.sort('_id')

		boards.forEach(board => {
			board.findRole(ctx.state.user._id);
		})

		ctx.body = boards;
	},
	get: async ctx => {
		let board = await Board.findOne({
			slug: ctx.params.slug
		})
		.populate({
			path: 'groups.cards',
			model: 'cards',
			populate: {
				path: 'users.user',
				select: '-password -email'
			}
		})
		.populate('users.user', '-password -email')

		if(!board) return ctx.throw(404);

		board.findRole(ctx.state.user._id);
		board = board.toObject();

		if(board.userRole !== 'admin'){
			board.groups.forEach(group => {
				group.cards = group.cards.filter(c =>
					c.users.findIndex(u =>
						u.user._id.toString() === ctx.state.user._id.toString()
					) !== -1
				)
			})

			board.groups = board.groups.filter(group => group.cards.length > 0)
		} else {
			board.groups.forEach(group => {
				group.cards = group.cards.map(c => {
					if(c.users.findIndex(u =>
						u.user._id.toString() === ctx.state.user._id.toString()
					) === -1)
						c.disabled = true;
					return c
				})
			})
		}

		ctx.body = board;
	},
	trash: async ctx => {
		let board = await Board.findById(ctx.params.id)

		board.findRole(ctx.state.user._id);

		let boardCards = [];
		board.toObject().groups.forEach(g => {
			g.cards.forEach(c => {
				boardCards.push(c)
			})
		});

		let cards = await Card.find({ board : ctx.params.id })
		.select('_id title').lean()

		if(board.toObject().userRole === 'admin'){
			ctx.body = cards.filter(card =>
				!boardCards.find(c => c.toString() === card._id.toString())
			);
		}
	},
	post: async ctx => {
		let board = await Board.create({
			title: ctx.request.body.title,
			descr: ctx.request.body.descr,
			slug: ctx.request.body.slug,
			users: [{role:'admin', user: ctx.state.user._id}]
		});

		board.findRole(ctx.state.user._id);

		ctx.body = board
	},
	patch: async ctx => {
		delete ctx.request.body.slug;

		let board = await Board.findById(ctx.params.id)

		board.findRole(ctx.state.user._id);

		if(board.toObject().userRole !== 'admin')
			throw new Error('Denied');

		Object.assign(board, ctx.request.body);
		board = await board.save();

		ctx.body = await Board.populate(board,[{
			path: 'groups.cards',
			model: 'cards',
			select: '-users'
		},{
			path: 'users.user',
			select: '-password -email'
		}])
	},
	leave: async ctx => {
		let board = await Board.findById(ctx.params.id)

		board.findRole(ctx.state.user._id);

		if(board.toObject().userRole !== 'common')
			throw new Error('Denied');

		let index = board.users.findIndex(u => u.user.toString() === ctx.state.user._id);
		if(index > -1)
			board.users.splice(index, 1);
		else
			throw new Error(500);

		board.save();

		ctx.status = 200;
	},
	delete: async ctx => {
		let board = await Board.findById(ctx.params.id)

		board.findRole(ctx.state.user._id);
		if(board.toObject().userRole !== 'admin')
			throw new Error('Denied');

		if(board.groups.length !== 0)
			throw new Error('Board is not empty')
		else
			ctx.body = await Board.remove({_id: ctx.params.id})
	}
};
