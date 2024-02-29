var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url) 
    
    if (req.url == '/'){
        fs.readFile('index.html', (erro, dados) => {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(dados)
            res.end()
        }
        )
    }
    else if (req.url ==){
        
    }
