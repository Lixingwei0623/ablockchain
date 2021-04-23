var Chain=require("./Chain");
var BlockChain=new Chain.BlockChain();
var http=require('http');
var fs=require('fs');
var querystring=require('querystring');

var server=http.createServer(function (req,res) {
    var url=req.url;
    if (url=="/get"){
        res.writeHead(200,{'content-type':'text/plain'+'charset=UTF8'});
        var str=BlockChain.blocks;
        res.end(str.toString());
    }else if (url=="/creat"){
        var data=[];
        req.on('data',function (chunk) {
            data.push(chunk);
        })
        req.on('end',function (chunk){
            var dataObj=querystring.parse(data.toString())
            BlockChain.creatBlock(dataObj["data"]);
            var lastblock=BlockChain.getLastBlock();
            res.setHeader('content-type','text/plain;charset=UTF8');
            res.write(lastblock.toString());
            res.end("生成区块"+lastblock.index+"号成功！");
        })

    }else {
        res.setHeader('content-type','text/html;charset=UTF8');
        fs.readFile('./client.html',function (err,data) {
            res.write(data);
            res.end();
        })
    }

});
server.listen(2345);

