var mongoose = require("mongoose")


var commentSchema = new mongoose.Schema({
    autor: String,
    conteudo: String,
    data: String
}, { _id: false });

var postSchema = new mongoose.Schema({
    _id: String,
    descricao:String,
    dataRegisto:String,
    comentarios:[commentSchema],
    likes:[String],
    recurso:String
}, { versionKey: false })

module.exports = mongoose.model('post', postSchema,"posts")