var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET periodos listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  axios.get('http://localhost:3000/periodos?_sort=nome')
        .then(resp => {
            periodos = resp.data
            res.status(200).render('periodosListPage', {periodos:periodos, data: d})
        })
        .catch(err => {
            res.status(507).render('error', {"error": err})

        })
})

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  res.status(200).render('periodosFormPage', {date: d})
})

router.post('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  result = req.body
  axios.post('http://localhost:3000/periodos/', result)
    .then(resp => {
      res.redirect('/periodos')
    })
    .catch(erro => {
      res.status(508).render('error', {"error": erro})
   })
})

//get periodo
router.get('/:idperiodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var id = req.params.idperiodo
  axios.get('http://localhost:3000/periodos/' + id)
        .then(resp => {
            periodo = resp.data
            res.status(200).render('periodoPage', {periodo: periodo, data: d})
        })
        .catch(err => {
            res.status(509).render('error', {"error": err})
        })
})

//Get edit periodo
router.get('/edit/:idperiodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var id = req.params.idperiodo
  axios.get('http://localhost:3000/periodos/' + id)
        .then(resp => {
            periodo = resp.data
            res.status(200).render('periodoFormEditPage', {periodo: periodo, data: d})
        })
        .catch(err => {
            res.status(510).render('error', {"error": err})
        })
})

// post periodo
router.post('/edit/:idperiodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)  
  var periodo = req.body
  axios.put('http://localhost:3000/periodos/' + periodo.id, periodo)
        .then(resp => {
            res.redirect('/periodos')
        })
        .catch(err => {
            res.status(511).render('error', {"error": err})
        })
})

// Delete aluno
router.get('/delete/:idperiodo', function(req, res, next) {  
  var id = req.params.idperiodo
  axios.delete('http://localhost:3000/periodos/' + id)
        .then(resp => {
            periodo = resp.data
            res.redirect('/periodos')
        })
        .catch(err => {
            res.status(512).render('error', {"error": err})
        })
})

module.exports = router;
