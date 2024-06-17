const mongoose = require('mongoose')
var POST = require("../models/post")
const moment = require('moment');


module.exports.list = () => {
    return POST
        .find()
        .sort({likes : 1})
        .exec()
}

module.exports.findById = id => {
    return POST
        .findOne({_id : id})
        .exec()
}

module.exports.insert = post => {
    if((POST.find({_id : post._id}).exec()).length != 1){
        var newPOST = new POST(post)
        return newPOST.save()
    }
}

module.exports.update = (id, post) => {
    return POST
        .findByIdAndUpdate(id, post, {new : true})
        .exec()
}

module.exports.remove = id => {
    return POST
        .find({_id : id})
        .deleteOne()
        .exec()
}

module.exports.trendingPosts = async () => {
    try {
        // Define o limite de tempo de uma semana atrás a partir da data atual
        const oneWeekAgo = moment().subtract(7, 'days').toDate();

        const posts = await POST.aggregate([
            // Converte a string dataRegisto para uma data ISO
            {
                $addFields: {
                    dataRegistoISO: {
                        $dateFromString: {
                            dateString: "$dataRegisto",
                            format: "%d-%m-%Y %H:%M:%S",
                            onError: new Date("1970-01-01T00:00:00Z"), // Define uma data padrão em caso de erro
                            onNull: new Date("1970-01-01T00:00:00Z") // Define uma data padrão se o campo for nulo
                        }
                    }
                }
            },
            // Filtra os posts para incluir apenas aqueles registrados na última semana
            {
                $match: {
                    dataRegistoISO: { $gte: oneWeekAgo }
                }
            },
            // Adiciona um campo com o número de likes
            {
                $addFields: {
                    likesCount: { $size: "$likes" }
                }
            },
            // Ordena os documentos pelo número de likes em ordem decrescente
            {
                $sort: { likesCount: -1 }
            },
            // Limita os resultados aos 5 posts com mais likes
            {
                $limit: 5
            }
        ]);

        return posts;
    } catch (err) {
        throw err;
    }
};

module.exports.recentAdded = async () => {
    try {
        const posts = await POST.find()
            .sort({ dataRegisto: -1 })
            .limit(10)
            .exec();
        return posts;
    } catch (err) {
        throw err;
    }
};