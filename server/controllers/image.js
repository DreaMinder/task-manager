module.exports = {
	returnName: async ctx => {

		ctx.body = {
			name: ctx.req.file.filename
		}

	},
};
