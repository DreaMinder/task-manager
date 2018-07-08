let development = process.env.NODE_ENV !== 'production';
let skip = async function(ctx, next){ await next() };

if(development) require('dotenv').load();

module.exports = {
 cors: () => {
   if(development)
     return require('@koa/cors')({maxAge:10000,credentials:true})
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
