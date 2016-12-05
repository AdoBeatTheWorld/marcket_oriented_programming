var superagent = require("superagent");
var cheerio = require("cheerio");
var asyn = require("async");
var url = require("url");
var http = require("http");
var https = require("https");
var fs = require("fs");
var path = require("path");

var rootUrl = "https://www.lagou.com";

https.get(rootUrl, (res) => {
  res.on('data', (d) => {
    var $ = cheerio.load(d);
    $("div[class='menu_box']").each(function(k,v){
    	console.log(k+"==========="+v);
    });
  });

}).on('error', (e) => {
  console.error(e);
});