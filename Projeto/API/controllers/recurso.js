const mongoose = require('mongoose')
var RECURSO = require("../models/recurso")


module.exports.list = () => {
    return RECURSO
        .find()
        .sort({titulo : 1})
        .exec()
}

module.exports.findById = id => {
    return RECURSO
        .findOne({_id : id})
        .exec()
}

module.exports.insert = recurso => {
    if((RECURSO.find({_id : recurso._id}).exec()).length != 1){
        var newRECURSO = new RECURSO(recurso)
        return newRECURSO.save()
    }
}

module.exports.update = (id, recurso) => {
    return RECURSO
        .findByIdAndUpdate(id, recurso, {new : true})
        .exec()
}

module.exports.remove = id => {
    return RECURSO
        .find({_id : id})
        .deleteOne()
        .exec()
}

module.exports.bestResources = async () => {
    try {
        const resources = await RECURSO.aggregate([
            {
                $unwind: "$avaliacoes"
            },
            {
                $group: {
                    _id: "$_id",
                    tipo: { $first: "$tipo" },
                    titulo: { $first: "$titulo" },
                    subtitulo: { $first: "$subtitulo" },
                    dataCriacao: { $first: "$dataCriacao" },
                    dataRegisto: { $first: "$dataRegisto" },
                    visibilidade: { $first: "$visibilidade" },
                    autor: { $first: "$autor" },
                    ficheiro: { $first: "$ficheiro" },
                    avgRating: { $avg: "$avaliacoes.rating" }
                }
            },
            {
                $sort: { avgRating: -1 }
            },
            {
                $limit: 5
            }
        ]);
        return resources;
    } catch (err) {
        throw err;
    }
};