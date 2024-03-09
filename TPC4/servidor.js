var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')         
var static = require('./static.js') 

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation
var compositorServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url +" " + d)

    //Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/' || req.url == '/Compositores'){
                    axios.get('http://localhost:3000/Compositores?_sort=nome')
                        .then(resp => {
                            compositores = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores, d))
                            res.end()
                        })
                        .catch(err => {
                            res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores: " + err + "</p>")
                            res.end()
                        })
                }
                // GET /Compositores/:id --------------------------------------------------------------------
                else if(/\/Compositores\/C[0-9]+$/i.test(req.url)){
                    id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/Compositores/' + id)
                        .then(resp => {
                            compositor = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            console.log("aqui")
                            res.write(templates.compositorPage(compositor, d))
                            console.log("aqui2")
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a informação do Compositor: " + id + "::" + erro + "</p>")
                            res.end()
                        })                                
                }
                // GET /Compositores/registo --------------------------------------------------------------------
                else if(req.url == '/Compositores/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.compositorFormPage(d))
                    res.end()
                }
                // GET /Compositores/edit/id --------------------------------------------------------------------
               else if(/\/Compositores\/edit\/C[0-9]+$/i.test(req.url)){
                id = req.url.split("/")[3]
                axios.get('http://localhost:3000/Compositores/' + id)
                    .then(resp => {
                        compositor = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.compositorFormEditPage(compositor, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do Compositor: " + id + "::" + erro + "</p>")
                        res.end()
                    })
                }
                // GET /Compositores/delete/id --------------------------------------------------------------------
                else if(/\/Compositores\/delete\/C[0-9]+$/i.test(req.url)){
                    id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/Compositores/' + id)
                        .then(resp => { 
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Registo eliminado: " + JSON.stringify(resp.data) + "</p>")
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("erro " + erro)
                            res.end()
                        })
                }
                // GET /Periodos --------------------------------------------------------------------
                else if(req.url == '/Periodos'){
                    axios.get('http://localhost:3000/Periodos?_sort=id')
                        .then(resp => {
                            p = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.periodsListPage(p, d))
                            res.end()
                        })
                        .catch(err => {
                            res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de períodos: " + err + "</p>")
                            res.end()
                        })
                }
                // GET /Pedidos/id --------------------------------------------------------------------
                else if(/\/Periodos\/P[0-9]+$/i.test(req.url)){
                    id = req.url.split("/")[2]
                    axios.get('http://localhost:3000/Periodos/' + id)
                        .then(resp => {
                            p = resp.data
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write(templates.periodPage(p, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível obter a informação do aluno: " + id + "::" + erro + "</p>")
                            res.end()
                        })                                
                }
                // GET /Periodos/registo --------------------------------------------------------------------
                else if(req.url == '/Periodos/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.periodFormPage(d))
                    res.end()
                }
                // GET /Periodos/edit/id --------------------------------------------------------------------
               else if(/\/Periodos\/edit\/P[0-9]+$/i.test(req.url)){
                id = req.url.split("/")[3]
                axios.get('http://localhost:3000/Periodos/' + id)
                    .then(resp => {
                        p = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodFormEditPage(p, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(504, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Não foi possível obter a informação do aluno: " + id + "::" + erro + "</p>")
                        res.end()
                    })
               }
                // GET /alunos/delete/id --------------------------------------------------------------------
                else if(/\/Periodos\/delete\/.+$/i.test(req.url)){
                    id = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/Periodos/' + id)
                        .then(resp => { 
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Registo eliminado: " + JSON.stringify(resp.data) + "</p>")
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("erro " + erro)
                            res.end()
                        })
                }
                // GET ? -> Lancar um erro        
                else{
                    res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>GET request não suportado: " + req.url +  "</p>")
                    res.end()
                }
                break

            case "POST":
               // POST /Compositores/registo --------------------------------------------------------------------
               if(req.url == "/Compositores/registo"){
                    collectRequestBodyData(req, result => {
                        if (result){
                            //console.log(result)
                            axios.post('http://localhost:3000/Compositores/', result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Registo inserido: " + JSON.stringify(resp.data) + "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("erro " + erro)
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }   
                // POST /Compositores/edit/id --------------------------------------------------------------------
                else if(/\/Compositores\/edit\/C[0-9]+$/i.test(req.url)){
                    id = req.url.split("/")[3]
                    collectRequestBodyData(req, result => {
                        if (result){
                            //console.log(result)
                            axios.put('http://localhost:3000/Compositores/' + result.id, result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Registo alterado: " + JSON.stringify(resp.data) + "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("erro " + erro)
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(508, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /periodos/registo --------------------------------------------------------------------
                else if(req.url == "/Periodos/registo"){
                    collectRequestBodyData(req, result => {
                        if (result){
                            //console.log(result)
                            axios.post('http://localhost:3000/Periodos/', result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Registo inserido: " + JSON.stringify(resp.data) + "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("erro " + erro)
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /Periodos/edit/id --------------------------------------------------------------------
                else if(/\/Periodos\/edit\/P[0-9]+$/i.test(req.url)){
                    id = req.url.split("/")[3]
                    collectRequestBodyData(req, result => {
                        if (result){
                            //console.log(result)
                            axios.put('http://localhost:3000/Periodos/' + result.id, result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Registo alterado: " + JSON.stringify(resp.data) + "</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(507, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("erro " + erro)
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(506, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possível os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(509, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>POST request não suportado: " + req.url +  "</p>")
                    res.end()
                }
            
                break
            
            default:
                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p>Método não suportado" + req.method + "</p>")
                res.end()
                break
        }
    }
})

compositorServer.listen(9324, ()=>{
    console.log("Servidor à escuta na porta 9324...")
})
