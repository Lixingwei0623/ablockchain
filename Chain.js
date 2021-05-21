var fs=require('fs');
var querystring=require('querystring');
var Block=require("./Block");
//const genesisTime=1619079309.946;
const genesisBlock = new Block.Block(
    0, null, 1619079309.946, "genesis block", 'a17f9080db57e3b424f8aeeae6dfec58015c4268efbe9d86aadc5ab1f400bc0a', '2345'
);




class BlockChain{
    constructor(path) {
        this.blocks=[genesisBlock];
        this.path=path;
        this.head={};//节点信息


        try {
            var headdata=fs.readFileSync("./blcs/"+path+"/head.json");
            //console.log(headdata);
            this.head=JSON.parse(headdata.toString());
           // console.log(this.head);
            for (var i=1;i<this.head.nums;i++){
                try {
                    var data=fs.readFileSync("./blcs/"+this.path+"/block"+i+".json");
                    var blockobj=JSON.parse(data.toString());
                    //console.log(blockobj.data);
                    if (this.addBlock(blockobj)){
                        console.log("区块验证通过");
                    }
                }catch (err) {
                    console.log("读取文件区块失败");
                    console.log(err);
                }

            }
            //console.log(this.blocks);

        }catch (err) {//没有节点信息
            this.head.nums=1;
            this.head.port=this.path;
            this.head.fileName="block";
            this.head.existsHash=[];
            this.head.creators=[];
            //写入创世区块
            fs.mkdir("./blcs/"+path, { recursive: true }, function (err) {
                if (err!=null)
                    console.log(err);
            });
            try {
                fs.writeFileSync("./blcs/"+path+"/genesisBlock.json",JSON.stringify(genesisBlock,"","\t"));
            }catch (err) {
                console.log(err);
                console.log("写入创世区块err");
            }
            fs.readFile("./blcs/"+path+"/genesisBlock.json",function (err,data) {
                //console.log(data);
                console.log(JSON.parse(data.toString()).data);
            })
            this.head.existsHash.push(genesisBlock.hash);
            //写入节点信息
            try {
                fs.writeFileSync("./blcs/"+path+"/head.json",JSON.stringify(this.head,"","\t"));
            }catch (err) {
                console.log("写入head信息err");
            }

        }




    }
    creatBlock(data){
        var lastBlock=this.getLastBlock();
        var newIndex=lastBlock.index+1;
        var newTime=new Date().getTime()/1000;
        var newPreHash=lastBlock.hash;
        var creator= this.path;//简单的用端口来代替用户
        var newhash=Block.caHash(newIndex,newPreHash,newTime,data.toString(),creator);
        var newblock= new Block.Block(
            newIndex, newPreHash, newTime, data, newhash,creator
        );


        fs.writeFile("./blcs/"+this.path+"/block"+this.head.nums+".json",JSON.stringify(newblock,"","\t"),function (err){
            if (err!=null)
                console.log(err);
        });

        this.head.nums++;
        this.head.existsHash.push(newhash);
        if (!this.head.creators.includes(newblock.creator))
            this.head.creators.push(newblock.creator);

        console.log(this.head);

        fs.writeFile("./blcs/"+this.path+"/head.json",JSON.stringify(this.head,"","\t"),function (err){
            if (err!=null)
                console.log(err);
        });


        return this.blocks[this.blocks.length]=newblock;

    }
    getLastBlock() {
        return this.blocks[this.blocks.length-1];
    }

    validBlock(block,lastBlock) {

        if (!Block.isValidBlockStructure(block))
            return false;
        console.log(Block.caHash(block.index,block.previousHash,block.timestamp,block.data,block.creator)==block.hash);
        if (
            (block.index==lastBlock.index+1)
            &&(block.previousHash==lastBlock.hash)
            &&Block.caHash(block.index,block.previousHash,block.timestamp,block.data,block.creator)==block.hash
        )
            return true;
        return false;
    }

    addBlock(block){
        if (this.validBlock(block,this.getLastBlock())){
            this.blocks.push(block);
            return true;
        }
        console.log("addBlock:验证未通过");
        console.log(this.getLastBlock());
        console.log(block);
        return false;
    }

    receiveBlock(block){
        console.log("receive");
        if (this.head.existsHash.includes(block.hash)){
            return false;
        }else if (this.addBlock(block)){
            this.head.nums++;
            this.head.existsHash.push(block.hash);
            if (!this.head.creators.includes(block.creator)){
                this.head.creators.push(block.creator);
            }

            this.saveBlock();
            console.log("成功接受");
            return true;
        }else {
            console.log("接受失败");
            return false;
        }
    }

    saveBlock(){
        var headdata=fs.readFileSync("./blcs/"+this.path+"/head.json");
        var oldHead=JSON.parse(headdata.toString());
        if (oldHead.nums<this.head.nums){
            for (var i=oldHead.nums;i<this.head.nums+1;i++){
                try {
                    fs.writeFileSync("./blcs/"+this.path+"/block"+i+".json",JSON.stringify(this.blocks[i],"","\t"));
                }catch (err) {
                    if (err!=null)
                        console.log("小问题先不管");
                }
            }
            try {
                fs.writeFileSync("./blcs/"+this.path+"/head.json",JSON.stringify(this.head,"","\t"));
            }catch (err) {
                if (err!=null)
                    console.log(err);
            }
        }
    }

}

exports.BlockChain=BlockChain;
