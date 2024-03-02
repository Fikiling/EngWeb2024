var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url) 
    var q = url.parse(decodeURI(req.url), true);
    var re = /^\/html\/[A-Za-z\sÀ-ú%20-]+\.html$/;

    if (q.pathname == '/' || q.pathname == '/index.html'){
        fs.readFile('index.html', (erro, dados) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        }
        )
    }
    else if (re.test(q.pathname )){
        fs.readFile(decodeURIComponent(q.pathname.substring(1)), (erro, dados) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(dados);
            res.end();
        });
        
    }
    else if(q.pathname == "/w3.css"){
        fs.readFile("w3.css",function(err,data){
            res.writeHead(200,{"Content-Type": "text/css"})
            res.write(data)
            res.end()
        }) 

    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
        res.end()
    }

}).listen(7777)
console.log('Servidor à escuta na porta 7777...')   