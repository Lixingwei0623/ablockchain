
var Block=require("./Block");
//const genesisTime=1619079309.946;
const genesisBlock = new Block.Block(
    0, null, 1619079309.946, "genesis block", '80dea37cccca5fb56b9b78dbe2733fb19e8ee2aa7bb03d4ac1e361fe3fad7b51'
);
class BlockChain{
    constructor() {
        this.blocks=[genesisBlock];
    }
    creatBlock(data){
        var lastBlock=this.getLastBlock();
        var newIndex=lastBlock.index+1;
        var newTime=new Date().getTime()/1000;
        var newPreHash=lastBlock.hash;
        var newhash=Block.caHash(newIndex,newPreHash,newTime,data.toString());
        return this.blocks[this.blocks.length]= new Block.Block(
            newIndex, newPreHash, newTime, data, newhash
        );

    }
    getLastBlock() {
        return this.blocks[this.blocks.length-1];
    }

    vaildBlock(block,lastBlock) {
        if (!Block.isValidBlockStructure(block))
            return false;
        if (
            (block.index==lastBlock.index+1)
            &&(block.previousHash==lastBlock.previousHash)
            &&Block.caHash(block.index,block.previousHash,block.timestamp,block.data)
        )
            return true;
        return false;
    }

    addBlock(block){
        if (validBlock(block,this.getLastBlock())){
            blocks.push(block);
            return true;
        }
        return false;
    }

}

exports.BlockChain=BlockChain;
