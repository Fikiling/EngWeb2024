const axios = require('axios');

async function verificaAcesso(req, res, next) {
  if (req.cookies && req.cookies.token) {
    try {
      // Verify token with the authentication service
      const response = await axios.get('http://container-authentication:29052/auth/verify', {
        headers: { Authorization: `Bearer ${req.cookies.token}` }
      });
      req.body["user"]=response.data.user
      // Adicionar o token ao cabeçalho da requisição
      req.headers['authorization'] = `Bearer ${req.cookies.token}`;
      next();
    } catch (error) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
}

async function verificaLogado(req, res, next) {
  if (req.cookies && req.cookies.token) {
    req.body["logado"] = true
  } else {
    req.body["logado"] = false
  }
  next();
}



module.exports = { verificaAcesso, verificaLogado};