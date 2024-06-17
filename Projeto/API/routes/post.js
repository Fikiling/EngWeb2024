
var express = require('express');
var router = express.Router();
var POST = require('../controllers/post')

/* Listar os POST (R) */
router.get('/', function(req, res) {

    POST.list()
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

/* Trending POST (R) */
router.get('/trending', function(req, res) {
    POST.trendingPosts()
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

/* Recent POST (R) */
router.get('/recent', function(req, res) {
POST.recentAdded()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

/* Consultar um0 POST (R) */
router.get('/:id', function(req, res) {
    POST.findById(req.params.id)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

/* Criar um POST (C) */
router.post('/', function(req, res) {

    const currentDate = new Date();

    // Obter componentes da data atual
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
    const day = String(currentDate.getDate()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10

    // Obter componentes do tempo atual
    const hours = String(currentDate.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10

    // Formatar a data e o tempo como uma string no formato "DD-MM-YYYY HH:MM:SS"
    const dateTimeString = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    req.body["dataRegisto"]=dateTimeString
    req.body["comentarios"]=[]
    req.body["likes"]=[]
    
    console.log("Dados recebidos no pedido de adição de post: "+JSON.stringify(req.body)+"\n")

    POST.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.jsonp(erro))
});

/* Alterar um POST (U) */
router.put('/:id', function(req, res) {
    POST.update(req.params.id, req.body)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
    });

/* Remover um POST (D ) */
router.delete('/:id', function(req, res) {
    POST.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;
