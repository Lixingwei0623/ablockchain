/*
*  节点程序
*  运行命令为：node User.js 2343
*  在运行命令中带入该节点要运行在的端口号
*
* */


var http=require('http');
var fs=require('fs');
var querystring=require('querystring');
var Chain=require("./Chain");


var port=parseInt(process.argv[2]);
var BlockChain=new Chain.BlockChain(process.argv[2]);

var server=http.createServer(function (req,res) {
    var url=req.url;
    if (url=="/get"){
        res.writeHead(200,{'content-type':'text/plain;charset=UTF8'});
        var str=BlockChain.blocks;
        res.end(JSON.stringify(str,"","\t"));
    }else if (url=="/creat"){
        var data=[];
        req.on('data',function (chunk) {
            data.push(chunk);
        });
        req.on('end',function (chunk){
            var dataObj=querystring.parse(data.toString())
            BlockChain.creatBlock(dataObj["data"]);
            var lastblock=BlockChain.getLastBlock();
            res.setHeader('content-type','text/plain;charset=UTF8');
            res.write(lastblock.toString());
            res.end("生成区块"+lastblock.index+"号成功！");
            broadcastBlock(lastblock);
        });


    }else if (url=="/receive"){
        var ablockString=[];
        req.on('data',function (chunk) {
            ablockString.push(chunk);
        });
        req.on('end',function (chunk) {
            var ablock=JSON.parse(ablockString.toString());
            res.end();
            if(BlockChain.receiveBlock(ablock)){
                broadcastBlock(ablock);
            }

        });
        req.on('error',function (err) {
            console.log("拒绝了一个请求");
        });
        res.end();


    }else {
        res.setHeader('content-type','text/html;charset=UTF8');
        fs.readFile('./client.html',function (err,data) {
            res.write(data);
            res.end();
        })
    }
});

server.listen(port);
console.log(typeof port);



function broadcastBlock(block) {
    var blockString=JSON.stringify(block,"","\t");
    console.log("broadcast");
    var options = {
        hostname: 'localhost',
        port: 2343,
        path: '/receive',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(blockString)
        }
    };

    try {
        var req1=http.request(options,function (res) {
            res.on('end',function () {
                console.log("已经发送至："+(port+1));
            });
            res.on('data',function (chunk) {
                console.log("没什么");
                console.log(chunk);
            })
            res.on('error',function (err) {
                console.log((port+1)+"数据传输出错");
            })
        });
        req1.on('error',function (err) {
            console.log((port+1)+"未上线，未向其发送2");
            req1.end();
            //console.log(err);
        })
        req1.write(blockString);
        req1.end();
        //console.log("已经发送至："+(port+1));
    }catch (err) {
        console.log((port+1)+"发送失败");
    }


    var ports=BlockChain.head.creators;
    for (var i=0;i<ports.length;i++){
        options.port=ports[i];
        try {
            var req=http.request(options,function (res) {
                res.on('end',function () {
                    console.log("已经发送至："+ports[i]);
                });
                res.on('data',function (chunk) {
                    console.log("没什么");
                    console.log(chunk);
                })
                res.on('error',function (err) {
                    console.log(port[i]+"数据传输出错");
                })
            });
            req.on('error',function (err) {
                console.log((port[i])+"未上线，未向其发送2");
                req.end();
                //console.log(err);
            })
            req.write(blockString);
            req.end();
            //console.log("已经发送至："+ports[i]);
        }catch (err) {
            console.log(ports[i]+"发送失败");
        }

    }






}