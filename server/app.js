const koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');

const config = require('./config');
const router = require('./routes');
const init = require('./models')

new koa()
	.use(cors({ credentials: true }))
	.use(logger())
	.use(bodyparser({jsonLimit: '3mb'}))
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(config.port);
