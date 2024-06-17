var express = require('express');
var axios = require('axios');
var router = express.Router();
var auth = require("../auth/auth")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var fs = require('fs-extra')
const FormData = require('form-data');

// pagina principal
router.get('/', auth.verificaLogado, function(req, res, next) {
  ///////////////////// Obter os posts em trending /////////////////////
  axios.get('http://container-api:29050/posts/trending', { headers: { cookie: req.headers.cookie } })
    .then(trendingRes => {
      ///////////////////// Obter os posts em recent /////////////////////
      axios.get('http://container-api:29050/posts/recent', { headers: { cookie: req.headers.cookie } })
        .then(recentRes => {
          ///////////////////// Obter os melhores recursos  /////////////////////
          axios.get('http://container-api:29050/recursos/best', { headers: { cookie: req.headers.cookie } })
            .then(bestRes => {
              res.render('paginaPrincipal', {
                title: "Plataforma de Gestão e Disponibilização de Recursos Educativos",
                logado: req.body.logado,
                trending: trendingRes.data,
                recent: recentRes.data,
                best: bestRes.data
              });
            })
            .catch(erro => {
              res.render("error", { error: erro, message: "Erro ao recuperar melhores recursos" });
            });
        })
        .catch(erro => {
          res.render("error", { error: erro, message: "Erro ao recuperar recent" });
        });
    })
    .catch(erro => {
      res.render("error", { error: erro, message: "Erro ao recuperar trending" });
    });
});

///////////////////////////////////////////////////////////////////////////////////////////
//IMPORTAR E EXPORTAR

router.get('/exportar', auth.verificaAcesso, function(req, res, next) {
  if(req.body.user["level"]=="administrador"){
    axios({
      method: 'get',
      url: 'http://container-api:29050/export',
      responseType: 'stream'
    })
    .then(response => {
      res.setHeader('Content-Disposition', 'attachment; filename=full_backup.zip');
      response.data.pipe(res);
    })
    .catch(error => {
      res.render("error", {error: error, message:"Erro ao exportar"});
    });
  }
  else{
    res.redirect("/")
  }
});

router.get("/importar",auth.verificaAcesso,auth.verificaLogado,function(req, res, next) {
  if(req.body.user["level"]=="administrador"){
    res.render("importar",{title:"Pagina para importar ficheiros", logado: req.body.logado})
  }
  else{
    res.redirect("/")
  }
})

router.post("/importar",upload.single('zip'),function(req, res, next) {
  const filePath = __dirname+  "/../" +  req.file.path;

  // Cria um form data para enviar o arquivo
  const formData = new FormData();
  formData.append('zip', fs.createReadStream(filePath));

  // Chama a API com o arquivo
  axios.post('http://container-api:29050/import', formData, {
    headers: {
      ...formData.getHeaders()
    }
  })
  .then(response => {
    // Limpa o arquivo depois do upload
    fs.unlinkSync(filePath);
    return res.redirect("/")
  })
  .catch(error => {
    fs.unlinkSync(filePath);
    return res.render("error", {error: error, message:"Erro ao importar"});
  });


})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET pag registo. */
router.get('/registar', auth.verificaLogado, function(req, res, next) {
  res.render('paginaRegisto',{title:"Pagina Registo", failVazio:false, failRegisto:false, logado: req.body.logado});
});

/* POST pag registo. */
router.post('/registar', auth.verificaLogado, function(req, res, next) {
  // Obter os dados da pagina de registo
  const {username, password, name, email, filiacao } = req.body;

  // Validar
  if (!username || !password || !name || !email || !filiacao) {
    console.log("Dados inválidos!");
    return res.render('paginaRegisto', { title: "Pagina Registo", failVazio: true, failRegisto: false, failUser: false, logado: req.body.logado});
  } else {
    // Chamar a página de sucesso
    axios.post('http://container-authentication:29052/auth/register', req.body)
      .then(dados => {
        if (dados.data.error) {
          return res.render('paginaRegisto', { title: "Pagina Registo", failVazio: false, failRegisto: false, failUser: true, logado: req.body.logado});
        }
        else{
          return res.render('registoCompleto', { title: "Registo Completo!", dados: req.body , logado: req.body.logado});
        }
      })
      .catch(error => {
        console.error("Erro no registro:", error.message);
        return res.render('paginaRegisto', { title: "Pagina Registo", failVazio: false, failRegisto: true, failUser: false, logado: req.body.logado});
      });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET pag login */
router.get('/login', auth.verificaLogado, function(req, res, next) {
  res.render('paginaLogin',{title:"Pagina Login", failVazio: false, failLogin: false , logado: req.body.logado});
});

/* POST pag login */
router.post('/login', auth.verificaLogado, function(req, res, next) {
  // Obter os dados da pagina de registo
  const {username, password} = req.body;

  // Validar
  if (!username || !password) {
    console.log("Dados invalidos!");
    res.render('paginaLogin',{title:"Pagina Login", failVazio: true, failLogin: false , logado: req.body.logado});
  } else {
    // Chamar a página de sucesso
    axios.post('http://container-authentication:29052/auth/login', req.body)
      .then(dados => {
        res.cookie("token",dados.data.token)
        res.render('loginCompleto',{title:"Login Completo!", dados: req.body, logado: true})
    })
      .catch(ados => res.render('paginaLogin',{title:"Login Errado!", failVazio: false, failLogin: true, dados: req.body, logado: req.body.logado}))
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET pag logout */
router.get('/logout', function(req, res, next) {
  res.clearCookie("token")

  res.redirect('/')
});

module.exports = router;
