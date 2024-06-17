// Controlador para o modelo User
var crypto = require('crypto')
var mongoose = require('mongoose')
var User = require('../models/user')

// Devolve a lista de Users
module.exports.list = () => {
    return User
            .find()
            .sort('name')
            .then(resposta => {
                return resposta._id
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getIdbyUsername =(username) => {
    return User.findOne ({username: username})
            .then(resposta => {
                return resposta._id
            })
            .catch(erro => {
                return erro
            })
}


module.exports.getUser = (id) => {
    return User.findOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addUser = u => {
    return User.create(u)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateUser = (id, info) => {
    return User.updateOne({_id: id}, info)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateUserStatus = (id, status) => {
    return User.updateOne({_id:id}, {active: status})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateUserPassword = (id, pwd) => {
    return User.findById(id)
        .then(user => {
            if (!user) throw new Error('User not found');
            return user.setPassword(pwd.password);
        })
        .then(user => user.save())
        .then(resposta => resposta)
        .catch(erro => { throw erro });
};

module.exports.updateToProducer = (username) => {
    return User.findOne({ username: username })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            if (user.level === 'consumidor') {
                user.level = 'produtor';
                return user.save();
            } else {
                return user; 
            }
        });
};

module.exports.deleteUser = id => {
    return User.deleteOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}
 
