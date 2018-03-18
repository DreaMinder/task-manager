const { Task, Table, Event } = require('../models');

module.exports = {
	post: async ctx => {
		try {

			let taskData = ctx.request.body;
			taskData.table = ctx.params.tableId;
			taskData.manager = ctx.state.user._id;
			delete taskData._id;

			let task = await Task.create(taskData);

			ctx.body = await Task.populate(task, ['manager', 'subscribers'])

			let table = await Table.findById(ctx.params.tableId);
			table.tasks.push(task);
			table.save();

			Event.create({
				user: ctx.state.user._id,
				action: 'new_task',
				title: task.title,
				card: table.card
			})

		} catch(error){
			ctx.body = error;
		}
	},
	patch: async ctx => {
		try {

			delete ctx.request.body._id;

			let task = await Task.findByIdAndUpdate(
					ctx.params.taskId, ctx.request.body, {new: true}
				)
				.populate('manager')
				.populate('subscribers');

			ctx.body = task;

			const table = await Table.findById(task.table);

			Event.create({
				user: ctx.state.user._id,
				action: 'task_changed',
				title: task.title,
				card: table.card
			})

		} catch(error){
			console.error(error);
		}
	}
};
