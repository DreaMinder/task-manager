module.exports = {
	returnName: async ctx => {

		ctx.body = {
			name: ctx.req.file.filename
		}

	},
};

//
// let ObjectId = require('mongoose').Types.ObjectId;
// let multer = require('koa-multer');
// let fs = require('fs-extra');
// let Jimp = require('jimp');
// let path = require('path');
// const QUALITY = 80;
//
// let upload = multer({
//   storage: multer.diskStorage({
//     destination: function(req, file, callback) {
//       let url = req.url.split('/');
//       let path = `../public/uploads/${url[url.length-1]}`;
//       fs.mkdirsSync(path);
//       callback(null, path);
//     },
//     filename: function (req, file, cb) {
//         let ext = file.mimetype && file.mimetype.split('/')[1];
//         cb(null, new ObjectId() + '.' + ext)
//     },
//     fileFilter (req, file, cb) {
//       cb(null, true)
//     }
//   })
// })
//
// module.exports = {
//   upload: upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'images', maxCount: 10 }
//   ]),
//   return: async (ctx, next) => {
//     let files = ctx.req.files['image'];
//     if(!files) files = ctx.req.files['images']
//     ctx.body = files.map(f => f.filename);
// 		next()
//   },
//   crop: (type, width, height) => async (ctx, next) => {
//     try {
//       let files = ctx.req.files['image'];
//       if(!files) files = ctx.req.files['images']
//
//       files.forEach(async ({filename}) => {
//         let path = ctx.path.split('/')
//         path = `../public/uploads/${path[path.length-1]}`;
//
//         let image = await Jimp.read(`${path}/${filename}`);
//
//         image.cover(width, height)
//              .quality(QUALITY)
//              .write(`${path}/${type}/${filename}`);
//       })
//     } catch (error) {
//       console.error(error);
//     } finally {
//       next()
//     }
//   }
// };
