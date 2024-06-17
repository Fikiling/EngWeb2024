var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { v4: uuidv4 } = require('uuid');
var fs = require('fs-extra')
const archiver = require('archiver');
const path = require('path');
const crypto = require('crypto');
const axios = require("axios");
const FormData = require('form-data');
var auth = require("../auth/auth")

async function calculateFileHash(filePath) {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(filePath);
    for await (const chunk of input) {
      hash.update(chunk);
    }
    return hash.digest('hex');
  }




/* GET home recursos page. */
router.get('/', auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {

    axios.get("http://container-api:29050/recursos")
        .then(resposta=>{
            res.render('visualizarRecursos', { title: 'Gestao de Recursos' ,lista:resposta.data , logado: req.body.logado, acesso: req.body.user["level"], utilizador: req.body.user["username"]});
        })
        .catch(erro=>{
            res.render("error",{error: erro, message:"Erro ao recuperar os recursos"})
        })
    
});

/* GET add recursos. */
router.get('/add',auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {
    res.render('adicionarRecursos',{title:"Upload de Arquivos", logado: req.body.logado});
});


router.get("/download/tudo/:autor/:id", auth.verificaAcesso, auth.verificaLogado,function(req,res,next){
       
        axios.get(`http://container-api:29050/recursos/download/${req.params.autor}/${req.params.id}`,{responseType: 'arraybuffer'})
        .then(resposta=> {
             // Define o caminho do arquivo zip
            const filePath = __dirname + "/../downloads/" + req.params.id + ".zip";

            // Salva o arquivo zip diretamente no sistema de arquivos
            fs.writeFileSync(filePath, resposta.data, 'binary');
            //res.send("Download concluído!");
            res.download(filePath)
        })
        .catch(erro=>{
            res.render("error",{error: erro, message:"Erro ao dar download ao zip"})
        })
})

/*
router.get('/download/:autor/:id/:fname', function(req, res, next) {
    res.download(__dirname + "/../public/FileStore/Recursos/" + req.params.autor + "/" + req.params.id +"/"+ req.params.fname )
});*/



router.get('/:id',auth.verificaAcesso, auth.verificaLogado, function(req, res, next) {

    axios.get("http://container-api:29050/recursos/" + req.params.id)
        .then(resposta=>{
            /*
            console.log(resposta.data)

            const dirPath = __dirname + "/../public/FileStore/Recursos/" + resposta.data["autor"] + "/" + resposta.data["_id"] + "/"
            // Verificar se o diretório existe e, se não existir, criá-lo
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true }); // Cria o diretório recursivamente
            }
            // Inserir os ficheiros na resposta
            resposta.data.files.forEach(file => {
                const filePath = path.join(dirPath, file.filename);
                const contentBuffer = Buffer.from(file.content);
                fs.writeFileSync(filePath, contentBuffer); // Escreve o conteúdo do ficheiro no diretório

            });*/
            let media=0
            
            if(resposta.data["avaliacoes"].length!=0){
                let soma=0
                for(let i=0;i <resposta.data["avaliacoes"].length;i++){
                    soma+=resposta.data["avaliacoes"][i]["rating"]
                }
                media=soma/resposta.data["avaliacoes"].length
            }

            res.render('recurso', { title: 'Recurso ' + req.params.id ,item:resposta.data,mediaRating:media, logado: req.body.logado});
        })
        .catch(erro=>{
        res.render("error",{error: erro, message:"Erro ao recuperar o recurso"})
        })

});


//Post de varios ficheiros
router.post('/', upload.array('files'),auth.verificaAcesso, auth.verificaLogado, async function(req, res, next) {
    const logadoNovo = req.body.logado
    delete req.body.logado

    //console.log(req.body)

    req.body["autor"]=req.body.user["username"]

    //apagar o user do req.body
    delete req.body.user
    //console.log(req.body)
    const files = req.files;
    // Gerar um _id aleatório usando uuid
    const _id = uuidv4();
    req.body["_id"]=_id;

    // Verificar se foram enviados ficheiros
    if (!files || files.length === 0) {
        return res.render('adicionarRecursos', { title: 'Adicionar Recurso', failvazio: false, semfiles: true, logado: logadoNovo});
    }

    // Criar o diretório temporário para os arquivos
    const tempDir = path.join(__dirname, '../tmp');
    await fs.remove(tempDir);
    await fs.ensureDir(tempDir);

    try {
        // Mover os arquivos recebidos para o diretório temporário
        for (const file of files) {
            
        await fs.move(file.path, path.join(tempDir, file.originalname));
        }

        // Calcular os hashes de cada arquivo
        const manifest = [];
        for (const file of files) {
        const hash = await calculateFileHash(path.join(tempDir, file.originalname));
        manifest.push({
            filename: file.originalname,
            hash: hash
        });
        }

        // Criar o arquivo de manifesto
        const manifestPath = path.join(tempDir, 'manifest.txt');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

        // Criar o arquivo ZIP BagIt
        const zipPath = path.join(__dirname, `../uploads/${_id}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
        zlib: { level: 9 }
        });

        output.on('close', async () => {
            //console.log(`${archive.pointer()} total bytes`);
            //console.log('ZIP has been finalized and the output file descriptor has closed.');
            try {
            // Enviar o arquivo ZIP e os dados para a sua API
            // Aqui você faria uma requisição POST para a sua API, passando o arquivo ZIP e os dados como parte do corpo da requisição

            const zipFile = await fs.promises.readFile(zipPath);

            // Criar um objeto FormData para enviar os dados
            const formData = new FormData();
            formData.append('zip', zipFile, {filename:`${_id}.zip`});
                
            // Adicionar os campos do req.body ao FormData
            for (const [key, value] of Object.entries(req.body)) {
                console.log(key, value);
                formData.append(key, value);
            }
            await axios.post("http://container-api:29050/recursos",formData,{
                headers: {
                ...formData.getHeaders() // Adicionar os headers do FormData
                }
            })
            
            // Após o sucesso da requisição POST, atualizar o usuário para produtor
            const authHeader = req.headers['authorization'];
            console.log('AuthHeader:', authHeader);
            if (authHeader) {
                console.log('Token:', authHeader.split(' ')[1]);
                const token = authHeader.split(' ')[1];
                await axios.put("http://container-authentication:29052/auth/produtor",
                    { username: req.body.autor },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            res.render('addRecursoSucesso', { title: 'Recurso Adicionado com Sucesso', logado: logadoNovo});

           
        } catch (error) {
            // Se ocorrer um erro no axios.post, envie uma resposta de erro
            console.error('Erro ao enviar o arquivo ZIP e os dados para a API:', error);
            res.status(500).send('Erro ao enviar o arquivo ZIP e os dados para a API.');
          }
            
        
        });

        archive.on('error', (err) => {
            console.error(err);
            res.status(500).send('Erro ao criar o arquivo ZIP.');
        });

        archive.pipe(output);

        // Adicionar o conteúdo do diretório temporário ao arquivo ZIP
        archive.directory(tempDir, false);


        // Finalizar o arquivo ZIP
        archive.finalize();


    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar os arquivos.');
    }
});

//avaliar um recurso
router.post("/avaliar/:id",auth.verificaAcesso, auth.verificaLogado,function(req,res,next){
    axios.get("http://container-api:29050/recursos/" + req.params.id)
    .then(resposta=>{
        //verificar que o user ja avaliou
        if(resposta!=null){
            let encontrou = false 
            for (let i = 0; i < resposta.data["avaliacoes"].length; i++) {
                // Verifica se o usuario_id do objeto atual é igual ao usuario_id do req.body
                if (resposta.data["avaliacoes"][i].usuario_id === req.body.user["username"]) {
                    // Altera o valor do campo rating
                    resposta.data["avaliacoes"][i].rating = req.body["rating"];
                    // Saia do loop, pois já encontrou e alterou o objeto
                    encontrou=true
                    break;
                }
            }
            if(!encontrou){
                let avaliacao= {
                    usuario_id:req.body.user["username"],
                    rating:req.body["rating"]
                }
                resposta.data["avaliacoes"].push(avaliacao)
            }
            console.log(resposta.data)
            axios.put("http://container-api:29050/recursos/avaliar/" + req.params.id,resposta.data)
            .then(response=>{
                //res.render('recurso', { title: 'Recurso ' + req.params.id ,item:response.data});
                res.redirect("/recursos/"+req.params.id)
            })
            .catch(erro=>{
                res.render("error",{error: erro, message:"Erro ao alterar o recurso", logado: req.body.logado})
            })
        }
    })
    .catch(erro=>{
    res.render("error",{error: erro, message:"Erro ao recuperar o recurso"})
    })
})

module.exports = router;
