var jwt = require('jsonwebtoken')
var User = require('../controllers/user')

module.exports.verificaAcesso = function (req, res, next){
    var myToken = req.query.token || req.body.token || req.headers['authorization']
    
    if(myToken){

      if (myToken.startsWith('Bearer ')) {
        myToken = myToken.slice(7, myToken.length);
      }

      jwt.verify(myToken, "EngWeb2024", function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          req.user = payload;
          next()
        }
      })
    }
    else{
      res.status(401).jsonp({error: "Token inexistente!"})
    }
  }
  
module.exports.verificaAdmin = function (req, res, next) {
    if (req.user.level !== 'administrador') {
        return res.status(403).jsonp({ error: 'Unauthorized: Only admin can perform this action' });
    }
    next();
};
  
module.exports.verificaIdCorrespondenteOuAdmin = function (req, res, next) {
  const username = req.user.username;

  User.getIdbyUsername(username)
  .then(id => {
    if (req.user.level === 'administrador' || id.toString() === req.params.id ) {
      return next();
  }
  return res.status(403).jsonp({ error: 'Unauthorized: Token does not match user ID or user is not admin' });
})
  .catch(error => {
      console.error('Erro ao obter ID pelo username:', error);
      res.status(500).jsonp({ error: 'Internal Server Error' });
  });
};

module.exports.verificaIdCorrespondente = function (req, res, next) {
    console.log(req.user)
    if (req.user._id !== req.params.id) {
        return res.status(403).jsonp({ error: 'Unauthorized: Token does not match user ID' });
    }
    next();
};

module.exports.verificaProdutorOuAdmin = function (req, res, next) {
  if (req.user.level !== 'produtor' && req.user.level !== 'administrador') {
      return res.status(403).jsonp({ error: 'Unauthorized: Only produtor or admin can perform this action' });
  }
  next();
};