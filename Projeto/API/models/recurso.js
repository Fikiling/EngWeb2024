var mongoose = require("mongoose")

var recursoSchema = new mongoose.Schema({
    _id: String,
    tipo:String,
    titulo:String,
    subtitulo:String,
    dataCriacao:String,
    dataRegisto:String,
    visibilidade:String,
    autor:String,
    ficheiro:[String],
    avaliacoes:[{
        usuario_id:String,
        rating:Number
    }]
}, { versionKey: false })

module.exports = mongoose.model('recurso', recursoSchema,"recursos")