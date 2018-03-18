const jwt = require('jsonwebtoken');
const send = require('koa-send');
const { User, Invite } = require('../models')
const config = require('../config')
var transporter = require('nodemailer').createTransport({
    service: 'Gmail',
    auth: config.email
});

module.exports = {
  login: async ctx => {
    user = await User.findOne({
      email: ctx.request.body.email
    });

    if(user)
		  try{
         await new Promise((resolve, reject) => {
          user.comparePassword(ctx.request.body.password, function(err, isMatch) {
            if (err) throw err;
            if(isMatch){
              ctx.status = 200;
              ctx.body = {
                token: jwt.sign({ _id: user._id }, config.auth.secret),
              };
              resolve();
            } else
              reject()
          });
        })
		 } catch (err) {
			 ctx.status = 401
		 }
   else
      ctx.status = 401;
  },
  invite: async ctx => {

    const invite = await Invite.create({
      email: ctx.params.email
    })
//hardcode your url
    const link = '/api/auth/register/' + invite._id;

    const message = [
      'Здравствуйте.',
      'Один из пользователей сервиса Task Manager выслал Вам приглашение для регистрации.',
      'Пожалуйста, пройдите по ссылке чтобы начать регистрацию в Таск Менеджере:',
      '<a href="'+ link +'">'+ link +'</a>'
    ];

    ctx.body = {
      success: true
    }
    transporter.sendMail({
      from: 'Task Manager',
      to: ctx.params.email,
      subject: 'Приглашение',
      html: message.join('<br>')
    }, function(error, info) {
      if (error)
       console.log(error);
    });
  },
  registerForm: async ctx => {
      const invite = await Invite.findById(ctx.params.invite);

      if(invite)
        await send(ctx, 'public/register.html')
      else
        ctx.status = 401;

  },
  register: async ctx => {
    try{
      const invite = await Invite.findById(ctx.params.invite);

      if(!invite) throw new Error('No invite in DB');

      const user = await User.create(ctx.request.body);

      await Invite.remove({ _id:ctx.params.invite});

      ctx.body = {
        success: true
      }
    } catch(err){
      console.error(err);
      ctx.status = 500
    }
  }
}
