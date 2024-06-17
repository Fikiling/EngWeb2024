const pessoa = require('../models/pessoa')
var Pessoa = require('../models/pessoa')

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome: 1})
        .exec()
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id: id})
        .exec()
}

module.exports.insert = pessoa => {
        return Pessoa.create(pessoa)
}

module.exports.updateAluno = (id, pessoa) => {
    return Pessoa.updateOne({_id:id}, pessoa)
}

module.exports.remove = id => {
    return Pessoa.deleteOne({_id:id
    })
}
