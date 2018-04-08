const { Card, Event } = require('../models');

module.exports = {
	post: async ctx => {
		let card = await Card.findById(ctx.params.cardId)

		let note = card.notes.create({
			content: ctx.request.body.content,
			user: ctx.state.user._id
		});

		card.notes.unshift(note);
		card.save();

		await Card.populate(card, {path: 'notes.user'})

		ctx.body = card.notes.id(note._id);

		Event.create({
			user: ctx.state.user._id,
			action: 'new_note',
			card: card._id
		})
	},
	patch: async ctx => {
		let card = await Card.findById(ctx.params.cardId)

		let note = card.notes.id(ctx.params.noteId);
		note.content = ctx.request.body.content;

		if(ctx.request.body.comments)
			note.comments = ctx.request.body.comments;

		let newComment = note.comments[note.comments.length - 1];
		if(newComment) newComment.user = ctx.state.user._id;

	  let newCard = await Card.populate(card, ['notes.user', 'notes.comments.user'])

		ctx.body = newCard.notes.id(note._id);

		card.save();

		Event.create({
			user: ctx.state.user._id,
			action: 'note_edit',
			card: card._id
		})
	}
};
