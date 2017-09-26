var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require("path");
var db;

//var requestIp = require('request-Ip');
var logUpdater = function(req,res,next)
//app.use(requestIp.mw())
{
  if(req.url=='/' || req.url=='/index.html'){

    var clientIp = req.socket.remoteAddress;
    console.log(clientIp);
    db.collection('Enterenced').findOne({ip:clientIp},function(error, result) {

      if(error || !result)
      {
        var datas = {ip : clientIp, num : 1}
        console.log("non");
        db.collection('Enterenced').insert(datas,function(err,result){
          if(err)
            console.log(err);
          else {
            console.log("update");
          }
        })//insert end
      }//if end
      else {
        var newNum = result.num;
        newNum++;
        var query = {ip : clientIp}
        var setQuery = {ip : clientIp, num : newNum }
        var option = {upsert:true}
        db.collection('Enterenced').update(query,setQuery,option,function(err, result){

          if(err || !result)
            console.log("update Error");
          else {
            console.log("Sucees Update");
          }//else end
        }) // update end

      }//else end


    });

  }
  next();
}
var options = {
  index: "index.html"
};

connectionDB();

app.use(logUpdater);



app.use(express.static(path.join(__dirname, "public"), options));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/img")));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));





app.listen(3000,function(){
  console.log('Exprement')
})

function connectionDB()
{
  mongoose.connect('mongodb://namjin:opensw@ds133261.mlab.com:33261/opensw'); // 기본 설정에 따라 포트가 상이 할 수 있습니다.
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
	console.log("mongo db connection OK.");
    });
//  console.log(findData);
}
