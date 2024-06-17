var express = require('express');
var router = express.Router();
var axios= require("axios");
var { v4: uuidv4 } = require('uuid');
var multer = require('multer')
const upload = multer({ dest: 'uploads/' })
var auth = require("../auth/auth")

/* GET home page. */
router.get('/', auth.verificaAcesso, auth.verificaLogado ,function(req, res, next) {
  console.log(req.body)
  axios.get("http://container-api:29050/posts")
    .then(resposta=>{
      
      res.render('visualizarPosts', { title: 'Gestao de posts Home Page' ,lista:resposta.data, logado: req.body.logado});
    })
    .catch(erro=>{
      res.render("error",{error: erro, message:"Erro ao recuperar os posts"})
    })
  
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET add post */
router.get('/add',auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {
  // Obter recursos para poder ser visualizado no dropdown
  axios.get("http://container-api:29050/recursos")
    .then(resposta=>{
      res.render('addPost', { title: 'Página de adição de posts', logado: req.body.logado, recursos: resposta.data, utilizador: req.body.user["username"]});
    })
    .catch(erro=>{
      res.render("error",{error: erro, message:"Erro ao recuperar os recursos"})
    })
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/like/:id',auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {

    axios.get("http://container-api:29050/posts/" + req.params.id)
      .then(resposta=>{
        
        console.log(resposta.data)
        const username = req.body.user["username"];

        // Encontra o índice do username na lista
        const index = resposta.data["likes"].indexOf(username);

        if (index !== -1) {
          // Se o username for encontrado, remove-o da lista
          resposta.data["likes"].splice(index, 1);
        } else {
          // Se o username não for encontrado, adiciona-o à lista
          resposta.data["likes"].push(username);
        }

        axios.put("http://container-api:29050/posts/"+req.params.id,resposta.data)
        .then(response=>{
            // Verificar se dei like
            let deilike = false
            for (let i = 0; i < response.data["likes"].length; i++) {
              if (response.data["likes"][i] == username) {
                deilike = true
                break
              }
            }

            res.render('post', { title: 'Post ' + req.params.id ,item:response.data, logado: req.body.logado, deilike: deilike});
        })
        .catch(erro=>{
            res.render("error",{error: erro, message:"Erro ao atualizar o post"})
        })
      })
      .catch(erro=>{
        res.render("error",{error: erro, message:"Erro ao recuperar o post"})
      })
    
  });

  router.get("/comentario/escrever/:id",auth.verificaAcesso,function(req, res, next) {
    console.log(req.body)
    res.render('comentario', { title: 'Comentario para o post ' + req.params.id ,id:req.params.id , logado: req.body.logado});
  })

  

  router.get('/:id', auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {

    axios.get("http://container-api:29050/posts/" + req.params.id)
        .then(response=>{
          // Verificar se dei like
          const username = req.body.user["username"];
          let deilike = false
          for (let i = 0; i < response.data["likes"].length; i++) {
            if (response.data["likes"][i] == username) {
              deilike = true
              break
            }
          }

          res.render('post', { title: 'Post ' + req.params.id ,item:response.data, logado: req.body.logado, deilike: deilike});
      })
      .catch(erro=>{
        res.render("error",{error: erro, message:"Erro ao recuperar o post"})
      })
    
  });


  /* POST add post */
router.post('/add', auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {
  // Obter os dados da pagina de registo
  const {descricao, recurso} = req.body;

  // Gerar um UUID
  const _id = uuidv4();

  // Adicionar o UUID aos dados do post (O post precisa de um ID)
  const postData = { _id, descricao, recurso };

  // Validar
  if (!descricao || !recurso) {
    console.log("Dados invalidos!");
    return res.render('addPost', {failvazio: true, logado: req.body.logado});
  }

  // Verificar se o recurso existe na base de dados
  axios.get("http://container-api:29050/recursos/" + recurso)
      .then(resposta => {

        // RECURSO NAO EXISTE
        if(resposta.data == null || resposta.data.autor != req.body.user["username"]){
          return res.render('addPost', {failvazio: false, failrecurso: true, logado: req.body.logado});
        } 
        
        else {
          // Chamar a página de sucesso (Enviar post para a API)
          axios.post('http://container-api:29050/posts', postData)
          .then(dados => res.render('addPostSucesso'), {logado: req.body.logado})
          .catch(e => res.status(500).jsonp({error: e}))
        }
      })
      .catch(erro => {
        return res.render('addPost', {failvazio: false, faildata: true, logado: req.body.logado});
      })

});

  router.post('/comentario/:id', upload.none(),auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {
    const username = req.body.user["username"];
    console.log(req.body)
    axios.get("http://container-api:29050/posts/" + req.params.id)
      .then(resposta=>{
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
        var comentario={
            autor:req.body.user["username"],
            conteudo:req.body["conteudo"],
            data: dateTimeString
        } 
        resposta.data["comentarios"].push(comentario)
        axios.put("http://container-api:29050/posts/"+req.params.id,resposta.data)
        .then(response=>{
            // Verificar se dei like
            let deilike = false
            for (let i = 0; i < response.data["likes"].length; i++) {
              if (response.data["likes"][i] == username) {
                deilike = true
                break
              }
            }

            res.render('post', { title: 'Post ' + req.params.id ,item:response.data, logado: req.body.logado, deilike: deilike});
        })
        .catch(erro=>{
            res.render("error",{error: erro, message:"Erro ao atualizar o post"})
        })

        
      })
      .catch(erro=>{
        res.render("error",{error: erro, message:"Erro ao recuperar o post", logado: req.body.logado})
      })
    
  });
module.exports = router;