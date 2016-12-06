var superagent = require("superagent");
var cheerio = require("cheerio");
var asyn = require("async");
var url = require("url");
var http = require("http");
var https = require("https");
var fs = require("fs");
var path = require("path");

var rootUrl = "https://www.lagou.com";
var app = require("express")();
var $;


var content = '';

fs.readFile('./result/class_1481010149483.txt',(err, data) => {
  if( err ) console.error(err);
  
  

  parse(data);
  
});

/*
https.get(rootUrl, (res) => {
  
  file = fs.createWriteStream("./result/class_"+Date.now()+".txt");
  res.on('data', (d) => {
    console.log("Data incoming...");
    content += d;
  });

  res.on('end', () => {
    parse(content);
    file.write(content);
    file.end();
    console.log("Data Complete...");
  });

}).on('error', (e) => {
    console.error(e);
});
*/
var dataPool = {};
var today = new Date();
function parse(content){
  var file;
  var todayStr = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();
  if( !fs.existsSync("./result/"+todayStr+"/"))
    fs.mkdirSync("./result/"+todayStr+"/");

  $ = cheerio.load(content,{ignoreWhitespace: true});
  var mainClass;
  var secondClass;
  var classData;
  $('div[class="menu_box"]').each(function(k,v){
    console.log("====================");
    mainClass = parserMainClass(v);//menu_main job_hopping
    file = fs.createWriteStream("./result/"+todayStr+"/"+mainClass+".json");
    classData = [];
    
    parseSecondClass($(v).children()[1], classData);//menu_sub dn
    
    file.write(JSON.stringify(classData));
    file.end();
  });
}

function parserMainClass(value){
  var h2Item = $(value).children().children()[0];
  var title = h2Item.children[0].data;
  //file.write(title);
  //console.log(h2Item.children[0].data);
  return title;
}

function parseSecondClass(value, classArr){
  var item;
  var arr = value.children;
  var len = arr.length;
  var data,len1,arr1,item1,len2,arr2,item2;
  //console.log("*****************************");
  //console.log(value);
  //console.log("*****************************");
  //return;
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
      console.log("2 ~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log(item1);
      if( item1.name === "dt"){
        item1 = item1.children[1];
        //console.log("3~~~~~~~~~~~~~~~~~~~~~~~~~~");
        //console.log(item1);
        data = {};
        data.name = item1.children[0].data;
        data.isMain = 1;
        data.href = item1.attribs["href"];
        data.dataLgTjId = item1.attribs["data-lg-tj-id"];
        data.dataLgTjNo = item1.attribs["data-lg-tj-no"];
        data.dataLgTjCid = item1.attribs["data-lg-tj-cid"];
        classArr.push(data);
        //console.log(item1.children[0].data,item1.attribs["href"],item1.attribs["data-lg-tj-id"],item1.attribs["data-lg-tj-no"],item1.attribs["data-lg-tj-cid"]);
      }else if( item1.name === "dd"){
        console.log("4~~~~~~~~~~~~~~~~~~~~~~~~~~");
        arr2 = item1.children;
        len2 = arr2.length;
        for( var k = 0; k < len2; k++){
          item2 = arr2[k];
          if( item2.type === "text") continue;
          data = {};
          console.log("5~~~~~~~~~~~~~~~~~~~~~~~~~~");
          console.log(item2);
          data.name = item2.children[0].data;
          data.isMain = 0;
          data.href = item2.attribs["href"];
          data.dataLgTjId = item2.attribs["data-lg-tj-id"];
          data.dataLgTjNo = item2.attribs["data-lg-tj-no"];
          data.dataLgTjCid = item2.attribs["data-lg-tj-cid"];
          classArr.push(data);
          console.log(item2.children[0].data,item2.attribs["href"],item2.attribs["data-lg-tj-id"],item2.attribs["data-lg-tj-no"],item2.attribs["data-lg-tj-cid"]);
        }
      }
    }
    
  }
  return;
  if( arr !== undefined && arr.length != 0){
    //first main item
    //console.log("First",arr[1]);
    if(arr[1].children.length >= 2){
      item = arr[1];
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~");
      data.name = item.children[0].data;
      data.href = item.attribs["href"];
      data.dataLgTjId = item.attribs["data-lg-tj-id"];
      data.dataLgTjNo = item.attribs["data-lg-tj-no"];
      data.dataLgTjCid = item.attribs["data-lg-tj-cid"];
      classArr.push(data);
      //console.log(item.children[0].data,item.attribs["href"],item.attribs["data-lg-tj-id"],item.attribs["data-lg-tj-no"],item.attribs["data-lg-tj-cid"]);
    }
    if( arr.length >= 2){
       arr = arr[1].children;
       for(var i = 0 ; i < arr.length; i++){
        item = arr[i];
        if( item.name !== 'a') continue;
        console.log("---------------------------------");
        //console.log(item);
        data = {};
        data.name = item.children[0].data;
        data.href = item.attribs["href"];
        data.dataLgTjId = item.attribs["data-lg-tj-id"];
        data.dataLgTjNo = item.attribs["data-lg-tj-no"];
        data.dataLgTjCid = item.attribs["data-lg-tj-cid"];
        classArr.push(data);
       }
    }
  }
}

app.get("/", function(req, res){
  res.write(JSON.stringify(dataPool));
});

app.listen(3000, function(){
  console.log("App is listening on 3000");
});