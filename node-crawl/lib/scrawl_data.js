var superagent = require("superagent");
var cheerio = require("cheerio");
var asyns = require("async");
var fs = require("fs");
var path = require("path");

module.exports = {};

function startScrawlCount(dir){
	var files = fs.readdirSync(dir);
	files.forEach(function(file){
		var data = fs.readFileSync(dir+file);
		console.log(data.length);
	})
}