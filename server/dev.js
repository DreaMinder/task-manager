let development = process.env.NODE_ENV !== 'production';
let skip = async function(ctx, next){ await next() };

if(development) require('dotenv').load();

module.exports = {
 seeds: () => {
   if(development)
     return async function(ctx, next){
       let { User } = require('./models')
       let admin = await User.findOne({firstName: 'Admin'}).lean()
       if(!admin){
         let user = await User.create({
           firstName: 'Admin',
           lastName: 'Test',
           email: 'test@test.com',
           password: 'test'
         })
         console.log('Seed user created: ' + user);
       }
       await next()
     }
   else
     return skip
 },
 static: () => {
   if(development)
     return require('koa-static')('../public')
   else
     return skip
 }
}
