const {
	image, auth, event,
	board, card, list, table,
	note, task, user, tag
} = require('./controllers');

const jwt = require('koa-jwt');
const config = require('./config');
const multer  = require('koa-multer');
const router = new require('koa-router')().prefix('/api');

router.post('/login', auth.login)
		.post('/invite/:email', auth.invite)
	  .post('/register/:invite', auth.register)
		.get('/register/:invite', auth.registerForm);

router.use(jwt({secret: config.auth.secret}))

router.get('/users', user.search)
	  .get('/account', user.account)
	  .put('/account', user.put)
		.post('/logout', user.logout);

router.post('/boards', board.post)
		.get('/boards', board.query)
	  .get('/boards/:slug', board.get)
		.patch('/boards/:id', board.patch)
	  .delete('/boards/:id', board.delete)
		.get('/boards/:id/trash', board.trash)
		.patch('/boards/:id/leave', board.leave);

router.get('/cards', card.search)
	  .get('/cards/:cardId', card.get)
	  .post('/cards/:boardId', card.post)
	  .patch('/cards/:cardId', card.patch)
	  .delete('/cards/:cardId', card.delete);

router.post('/lists/:cardId', list.post)
	  .patch('/lists/:listId', list.patch);

router.post('/notes/:cardId', note.post)
	  .patch('/notes/:cardId/:noteId', note.patch);

router.post('/tables/:cardId', table.post)
	  .patch('/tables/:tableId', table.patch);

router.post('/tasks/:tableId', task.post)
	  .patch('/tasks/:taskId', task.patch);

router.get('/events/card/:id', event.card)

router.put('/images/board', multer({ dest: 'public/uploads/board' }).single('image'), image.returnName)
	  .put('/images/avatar', multer({ dest: 'public/uploads/avatar' }).single('image'), image.returnName);

module.exports = router;
