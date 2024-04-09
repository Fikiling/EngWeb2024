var express = require('express');
var router = express.Router();
var Pessoa = require('../controllers/pessoa')

/* GET Pessoas */
router.get('/pessoas', function(req, res) {
  Pessoa.list()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.jsonp(erro))
});

/* GET Pessoas  */
router.get('/pessoas/:id', function(req, res) {
  Pessoa.findById(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.jsonp(erro))
});

router.post('/pessoas', function(req, res) {
  console.log(req.body)
  Pessoa.insert(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(erro => res.status(523).jsonp(erro))
});

router.put('/pessoas/:id', function(req, res) {
  Pessoa.updateAluno(req.params.id, req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(erro => res.status(524).jsonp(erro))
});

router.delete('/pessoas/:id', function(req, res) {
  Pessoa.remove(req.params.id)
    .then(dados => res.status(201).jsonp(dados))
    .catch(erro => res.status(525).jsonp(erro))
}
);


module.exports = router;
