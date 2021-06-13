var sha256=require("sha256");
class Block {
    constructor(index, previousHash, timestamp, data, hash, creator) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
        this.creator = creator;
    }
    toString(){
        return "\n{\nindex:"+this.index+",\npreviousHash:'"+this.previousHash+"',\ntimestamp:"+this.timestamp+",\ndata:'"+this.data+"',\nhash:'"+this.hash+"',\ncreator:'"+this.creator+ "'\n}\n"
    }
}
exports.Block=Block;
exports.newBlock=function (index, previousHash, timestamp, data, creator){
    var hash=caHash(index, previousHash, timestamp, data, creator);
    var block=new Block(index, previousHash, timestamp, data,hash, creator);
    return block;
}
exports.caHash=function (index, previousHash, timestamp, data, creator){
    var hash=sha256(index + previousHash + timestamp + data + creator);
    // console.log(hash);
    // console.log(parseInt(hash.charAt(0)));
    // var num=hash.charAt(0);
    // console.log(num);
    return sha256(index + previousHash + timestamp + data+ creator).toString();
}

exports.isValidBlockStructure =function (block){
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.creator === 'string'
        && typeof block.data === 'string';
};


