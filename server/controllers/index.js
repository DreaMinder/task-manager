const normalizedPath = require("path").join(__dirname);
const files = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
	if(file !== 'index.js')
  		files[file.split('.')[0]] = require("./" + file)
});

module.exports = files;
