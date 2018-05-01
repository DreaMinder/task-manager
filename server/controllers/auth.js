const jwt = require('jsonwebtoken');
const send = require('koa-send');
const { User, Invite } = require('../models')
var transporter = require('nodemailer').createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
});

module.exports = {
  login: async ctx => {
    let user = await User.findOne({
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
                token: jwt.sign({ _id: user._id }, process.env.SECRET),
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

	  const domain = 'https://domain.com'
    const link = domain + '/api/auth/register/' + invite._id;

    const message = [
      'Hello.',
      'You have invite to Task Manager. Follow this link to register:',
      '<a href="'+ link +'">'+ link +'</a>'
    ];

    ctx.body = {
      success: true
    }

    transporter.sendMail({
      from: 'Task Manager',
      to: ctx.params.email,
      subject: 'Invite',
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
    const invite = await Invite.findById(ctx.params.invite);

    if(!invite) throw new Error('No invite in DB');

    const user = await User.create(ctx.request.body);

    await Invite.remove({ _id:ctx.params.invite});

    ctx.body = {
      success: true
    }
  }
}
