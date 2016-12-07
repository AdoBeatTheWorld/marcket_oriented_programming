var superagent = require("superagent");
var cheerio = require("cheerio");
var async = require("async");
//var url = require("url");
//var http = require("http");
//var https = require("https");
var fs = require("fs");
var path = require("path");

var rootUrl = "https://www.lagou.com";
//var app = require("express")();
var $;


var content = '';
//for test only
/**/
fs.readFile('./result/class_1481010149483.txt',(err, data) => {
  if( err ) console.error(err);
  parse(data);
});
/**//*
superagent
  .get(rootUrl)
  .end(function(err, res){
    file = fs.createWriteStream("./result/class_"+Date.now()+".txt");
    parse(res.text);
    file.write(res.text);
    file.end();
    //console.log("Data Complete...");
});
*/
var dataPool = {};
var today = new Date();
var curDir;
function parse(content){
  var file;
  var todayStr = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();
  curDir = "./result/"+todayStr+"/";
  if( !fs.existsSync(curDir)){
    fs.mkdirSync(curDir);

    file = fs.createWriteStream("./result/config.js");
    file.write("var revision = "+todayStr+";");
    file.end();
  }

  $ = cheerio.load(content,{ignoreWhitespace: true});
  var mainClass;
  var secondClass;
  var classData;
  $('div[class="menu_box"]').each(function(k,v){
    //console.log("====================");
    mainClass = parserMainClass(v);//menu_main job_hopping
    file = fs.createWriteStream(curDir+mainClass+".json");
    classData = [];
    
    parseSecondClass($(v).children()[1], classData);//menu_sub dn
    
    file.write(JSON.stringify(classData));
    file.end();
  });

  startScrawlCount(curDir);
}

function parserMainClass(value){
  var h2Item = $(value).children().children()[0];
  var title = h2Item.children[0].data;
  return title.trim();
}

function parseSecondClass(value, classArr){
  var item;
  var arr = value.children;
  var len = arr.length;
  var data,len1,arr1,item1,len2,arr2,item2;
  //console.log("*****************************");
  for(var i = 0 ; i < len ; i++){//dl
    item = arr[i];
    if( item.type === "text") continue;
    //console.log("1~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //console.log(item);
    arr1 = item.children;
    len1 = arr1.length;
    for(var j = 0; j < len1; j++){
      item1 = arr1[j];
      if( item1.type === "text") continue;
      //console.log("2 ~~~~~~~~~~~~~~~~~~~~~~~~~~");
      //console.log(item1);
      if( item1.name === "dt"){
        item1 = item1.children[1];
        //console.log("3~~~~~~~~~~~~~~~~~~~~~~~~~~");
        //console.log(item1);
        data = {};
        data.name = item1.children[0].data;
        data.isMain = 1;
        data.href = item1.attribs["href"].substring(2);
        data.dataLgTjId = item1.attribs["data-lg-tj-id"];
        data.dataLgTjNo = item1.attribs["data-lg-tj-no"];
        data.dataLgTjCid = item1.attribs["data-lg-tj-cid"];
        classArr.push(data);
        //console.log(item1.children[0].data,item1.attribs["href"],item1.attribs["data-lg-tj-id"],item1.attribs["data-lg-tj-no"],item1.attribs["data-lg-tj-cid"]);
      }else if( item1.name === "dd"){
        //console.log("4~~~~~~~~~~~~~~~~~~~~~~~~~~");
        arr2 = item1.children;
        len2 = arr2.length;
        for( var k = 0; k < len2; k++){
          item2 = arr2[k];
          if( item2.type === "text") continue;
          data = {};
          //console.log("5~~~~~~~~~~~~~~~~~~~~~~~~~~");
          //console.log(item2);
          data.name = item2.children[0].data;
          data.isMain = 0;
          data.href = item2.attribs["href"].substring(2);
          data.dataLgTjId = item2.attribs["data-lg-tj-id"];
          data.dataLgTjNo = item2.attribs["data-lg-tj-no"];
          data.dataLgTjCid = item2.attribs["data-lg-tj-cid"];
          classArr.push(data);
          //console.log(item2.children[0].data,item2.attribs["href"],item2.attribs["data-lg-tj-id"],item2.attribs["data-lg-tj-no"],item2.attribs["data-lg-tj-cid"]);
        }
      }
    }
  }
}

const JOB_PER_PAGE = 15;

function startScrawlCount(dir){
  var files = fs.readdirSync(dir);
  files.forEach(function(file){
    scrawlFile(file,dir);
  });
  
}

function scrawlFile(file, dir){
  //var file = files[index];
  var data;
  /*
  fs.open(dir+file, 'r+', (err, fd){
    if (!err){
        fs.close(fd,function(){
            console.log("closed");
        });
    }
  });
  
*/
  fs.readFile(dir+file,{encoding:'utf8',flag:"r+"},(err, content) =>{
    //console.log("now:",dir+file)
    
    if( err ) console.error(err);

    data = JSON.parse(content);
    var completeCnt = 0;

    async.eachLimit(data,3,function(item, callback){
      
      superagent
        .get(item.href)
        .set("index_location_city","%E5%8C%97%E4%BA%AC")
        .end(function(err, res){
          
          if( err ) console.error(err);

          $ = cheerio.load(res.text);
          console.log(item.href);
          var arr = $("#tab_pos").text().match(/\d+[+]?/);
          if( arr.length != 0){
            var countStr = arr[0];
            if(countStr.indexOf("+") == -1){
              item.count = parseInt(countStr);
              //console.log(item.count);
            }else{
              var arr1 = $(".page_no");
              var maxIndex = 1;
              var tempIndex;
              var len = arr1.length
              var pageItem;
              for(var i = 0; i < arr1.length; i++){
                pageItem = arr1[i];
                tempIndex = parseInt(pageItem.attribs["data-index"]);
                maxIndex = tempIndex > maxIndex ? tempIndex : maxIndex;
              }
              //console.log("Count",countStr,"Page:",maxIndex);
              item.count = maxIndex * JOB_PER_PAGE;
            }
          }
          completeCnt++;
          //console.log(completeCnt+"/"+data.length);
          callback(err, res);
        });
    },function(err){
      if( err ) console.error(err);

      console.log("hehe");
      var wfile = fs.createWriteStream(dir+file);
      wfile.write(JSON.stringify(data));
      wfile.end();
      /*
      console.log(files, index);
      if( files.length > index + 1){
        scrawlFile(files, index+1);
      }*/
    });
  });
}