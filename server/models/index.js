const mongoose = require('mongoose');
let config = require('../config');

let connect = async function(){
	try {
		await mongoose.connect(`mongodb://localhost/${config.db}`);

		if('production' === process.env.NODE_ENV)
			console.log(`--------- ${(new Date()).toISOString()}`);

		console.log(`--------- DB: ${config.db}, Port: ${config.port}`);
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
