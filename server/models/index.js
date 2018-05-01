let mongoose = require('mongoose');

let connect = async function(){
	try {
		await mongoose.connect(`mongodb://localhost/${process.env.DB}`);

		if('production' === process.env.NODE_ENV)
			console.log(`--------- ${(new Date()).toISOString()}`);

		console.log(`--------- DB: ${process.env.DB}, Port: ${process.env.PORT}`);
	} catch(err){
		console.error(err);
	}
}()

let normalizedPath = require("path").join(__dirname);
let files = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
	if(file[0] !== file[0].toLowerCase())
  		files[file.split('.')[0]] = require("./" + file)
});

module.exports = files;
