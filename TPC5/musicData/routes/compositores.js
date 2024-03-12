var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET compositores listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  axios.get('http://localhost:3000/compositores?_sort=nome')
        .then(resp => {
            compositores = resp.data
            res.status(200).render('compositoresListPage', {compositores:compositores, data: d})
        })
        .catch(err => {
            res.status(501).render('error', {"error": err})

        })
})

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  res.status(200).render('compositoresFormPage', {date: d})
})

router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  result = req.body
  axios.post('http://localhost:3000/compositores/', result)
    .then(resp => {
      res.redirect('/')
    })
    .catch(erro => {
      res.status(502).render('error', {"error": erro})
   })
})

//get Compositor
router.get('/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var id = req.params.idCompositor
  axios.get('http://localhost:3000/compositores/' + id)
        .then(resp => {
            compositor = resp.data
            res.status(200).render('compositorPage', {compositor: compositor, data: d})
        })
        .catch(err => {
            res.status(503).render('error', {"error": err})
        })
})

//Get edit compositor
router.get('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var id = req.params.idCompositor
  axios.get('http://localhost:3000/compositores/' + id)
        .then(resp => {
            compositor = resp.data
            res.status(200).render('compositorFormEditPage', {compositor: compositor, data: d})
        })
        .catch(err => {
            res.status(504).render('error', {"error": err})
        })
})

// post compositor
router.post('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var compositor = req.body
  axios.put('http://localhost:3000/compositores/' + compositor.id, compositor)
        .then(resp => {
            res.redirect('/')
        })
        .catch(err => {
            res.status(505).render('error', {"error": err})
        })
})

// Delete aluno
router.get('/delete/:idCompositor', function(req, res, next) {  
  var id = req.params.idCompositor
  axios.delete('http://localhost:3000/compositores/' + id)
        .then(resp => {
            compositor = resp.data
            res.redirect('/')
        })
        .catch(err => {
            res.status(506).render('error', {"error": err})
        })
})

module.exports = router;
