var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

router.get('/', auth.verificaAcesso, function(req, res){
  User.list()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/verify', auth.verificaAcesso, function(req, res){

  res.status(200).jsonp({message: "Token válido",user:req.user})
})


router.get('/:id', auth.verificaAcesso, auth.verificaIdCorrespondenteOuAdmin, function(req, res){
  User.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/', auth.verificaAcesso, function(req, res){
  User.addUser(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/register', function(req, res) {
  userModel.findOne({ username: req.body.username })
      .then(existingUser => {
          if (existingUser) {
              throw new Error('Username em uso, por favor insira outro.');
          } else {
              var d = new Date().toISOString().substring(0, 10);
              return userModel.register(new userModel({
                  username: req.body.username,
                  name: req.body.name,
                  email: req.body.email,
                  filiacao: req.body.filiacao,
                  level: "consumidor",
                  active: true,
                  dateRegisto: d
              }), req.body.password);
          }
      })
      .then(user => {
          passport.authenticate("local")(req, res, function() {
              jwt.sign({
                  username: req.user.username,
                  level: req.user.level,
                  sub: 'projeto de EngWeb2024'
              }, "EngWeb2024", { expiresIn: 3600 }, function(e, token) {
                  if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e });
                  else res.status(201).jsonp({ token: token });
              });
          });
      })
      .catch(err => {
          res.jsonp({ error: err.message, message: "Erro de Registo: " + err.message });
      });
});
  
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.log('Erro na autenticação:', err);
      return next(err);
    }
    if (!user) {
      console.log('Autenticação falhou:', info);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ username: user.username, level: user.level }, 'EngWeb2024', { expiresIn: '1h' });
      return res.json({ token });
    });
  })(req, res, next);
})

router.put('/produtor', auth.verificaAcesso, function(req, res) {
  const { username } = req.body;
  User.updateToProducer(username)
      .then(user => {
          if (user.level === 'consumidor') {
              res.jsonp({ message: 'User updated to producer', user: user });
          } else {
              res.jsonp({ message: 'User is already a producer or has a higher level', user: user });
          }
      })
      .catch(error => {
          if (error.message === 'User not found') {
              res.status(404).jsonp({ error: error.message });
          } else {
              res.status(500).jsonp({ error: 'Error updating user: ' + error });
          }
      });
});

router.put('/:id', auth.verificaAcesso, auth.verificaIdCorrespondenteOuAdmin, function(req, res) { 
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/:id/desativar', auth.verificaAcesso, auth.verificaAdmin, function(req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na destaivação do utilizador"})
    })
})

router.put('/:id/ativar', auth.verificaAcesso, auth.verificaAdmin, function(req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
        res.render('error', {error: erro, message: "Erro na ativação do utilizador"})
    })
})

router.put('/:id/password', auth.verificaAcesso, auth.verificaIdCorrespondenteOuAdmin, function(req, res) {
  User.updateUserPassword(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração da pass do utilizador"})
    })
})



router.delete('/:id', auth.verificaAcesso, auth.verificaIdCorrespondenteOuAdmin, function(req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na remoção do utilizador"})
    })
})

module.exports = router;