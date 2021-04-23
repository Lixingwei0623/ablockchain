var sha256=require("sha256");
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
    toString(){
        return "\n{\nindex:"+this.index+",\npreviousHash:'"+this.previousHash+"',\ntimestamp:"+this.timestamp+",\ndata:'"+this.data+"',\nhash:'"+this.hash+"'\n}\n"
    }
}
exports.Block=Block;
exports.newBlock=function (index, previousHash, timestamp, data){
    var hash=caHash(index, previousHash, timestamp, data);
    var block=new Block(index, previousHash, timestamp, data,hash);
    return block;
}
exports.caHash=function (index, previousHash, timestamp, data){
    return sha256(index + previousHash + timestamp + data).toString();
}
exports.isValidBlockStructure =function (block){
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};

