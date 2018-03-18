const User = require('../models/User');

module.exports = {
	put: async ctx => {
		try {
			delete ctx.request.body._id;

			ctx.body = await User.findByIdAndUpdate(
					ctx.state.user._id, ctx.request.body, {new: true}
				);

		} catch(error){
			console.error(error);
		}
	},
	account: async ctx => {
		try{

			ctx.body = await User.findById(ctx.state.user._id).select('-password')

		} catch(error){
			console.error(error);
		}
	},
	search: async ctx => {
		try{

			const query = { $regex: ctx.request.query.search, $options: "i" };

			ctx.body = await User.find({
				$or: [
					{'lastName': query},
					{'firstName': query},
					{'email': query}
				]
			}).select('-password -email')

		} catch(error){
			console.error(error);
		}
	},
};
