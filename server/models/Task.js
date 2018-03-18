const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['', 'snooze','working','done','not_done','waiting']
    },
    table: {
        type: Schema.Types.ObjectId,
        ref: 'table'
    },
    descr: String,
    //timeCreated: {type: Date, default: Date.now},
    start: Date,
    finish: Date,
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    subscribers: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
  },{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

Task.virtual('timeLeft').get(function() {
    const now = new Date();
    if(this.timeFinish && now < this.timeFinish)
        return moment().isoWeekdayCalc(now,this.timeFinish,[1,2,3,4,5]);
    else return null
});

Task.virtual('timeLast').get(function() {
    const now = new Date();
    if(this.timeStarted)
        return moment().isoWeekdayCalc(this.start,this.finish || now,[1,2,3,4,5]);
    else return null
});

module.exports = mongoose.model('tasks', Task);
