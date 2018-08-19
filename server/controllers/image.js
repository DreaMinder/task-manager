let ObjectId = require('mongoose').Types.ObjectId;
let multer = require('koa-multer');
let Jimp = require('jimp');
const QUALITY = 70;

let upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      let path = `../public/uploads/raw`;
      callback(null, path);
    },
    filename: function (req, file, cb) {
      let ext = file.mimetype && file.mimetype.split('/')[1];
      cb(null, new ObjectId() + '.' + ext)
    },
    fileFilter (req, file, cb) {
      cb(null, true)
    }
  })
})

module.exports = {
  upload: upload.fields([
    { name: 'image', maxCount: 1 }
  ]),
  return: async (ctx, next) => {
		ctx.body = {
			name: ctx.req.files['image'][0].filename
		}
		next()
  },
  crop: (width, height) => async (ctx, next) => {
    try {
      let files = ctx.req.files['image'];

      files.forEach(async ({filename}) => {
        let reqPath = ctx.path.split('/')
        let path = `../public/uploads`;

        let image = await Jimp.read(`${path}/raw/${filename}`);

        image.cover(width, height)
             .quality(QUALITY)
             .write(`${path}/${reqPath[reqPath.length-1]}/${filename}`);
      })
    } catch (error) {
      console.error(error);
    } finally {
      next()
    }
  }
};
