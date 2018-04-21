const User = require('../models/User');

module.exports = {
	put: async ctx => {
		delete ctx.request.body._id;

		ctx.body = await User.findByIdAndUpdate(
			ctx.state.user._id, ctx.request.body, {new: true}
		);
	},
	account: async ctx => {
		let user = await User.findById(ctx.state.user._id)
		.select('-password')
		.lean()

		ctx.body = { user }
	},
	logout: async ctx => {
		ctx.status = 401
	},
	search: async ctx => {
		const query = {
			$regex: ctx.request.query.search,
			$options: "i"
		};

		ctx.body = await User.find({
			$or: [
				{'lastName': query},
				{'firstName': query},
				{'email': query}
			]
		}).select('-password -email')
		.lean()
	},
};
