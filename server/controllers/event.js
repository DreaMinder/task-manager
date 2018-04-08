const {Card, Event} = require('../models');

module.exports = {
	card: async ctx => {
		let card = await Card.findById(ctx.params.id)
		card.findRole(ctx.state.user._id);

		ctx.body = await Event.find({
			card: ctx.params.id
		})
		.sort('-_id')
		.limit(parseInt(ctx.query.limit))
		.populate('user', '-email -password')
		.lean();
	}
};
