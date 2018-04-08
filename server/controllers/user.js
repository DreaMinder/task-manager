const User = require('../models/User');

module.exports = {
	put: async ctx => {
		delete ctx.request.body._id;

		ctx.body = await User.findByIdAndUpdate(
			ctx.state.user._id, ctx.request.body, {new: true}
		);
	},
	account: async ctx => {
		ctx.body = await User.findById(ctx.state.user._id)
		.select('-password')
		.lean()
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
