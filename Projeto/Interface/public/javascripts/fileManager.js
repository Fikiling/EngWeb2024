$(function(){

})

function showImage(fname,ftype,autor,id){
    console.log("aqui")
    if((ftype == "image/png") || (ftype=="image/jpeg")){
        var ficheiro= $('<img src="/FileStore/Recursos/' + autor + "/" + id + "/" + fname + '" width="80%"/>')
        var download = $('<div><a href ="/recursos/download/' + autor + "/" + id + "/"+ fname + '">Download</a></div>')
        $("#display").empty()
        $("#display").append(ficheiro,download)
        $("#display").modal()
    }
    else{
        var ficheiro= $('<p>' + fname + '</p>')
        var download = $('<div><a href ="/recursos/download/' + autor + "/" + id + "/"+ fname + '">Download</a></div>')
        $("#display").empty()
        $("#display").append(ficheiro,download)
        $("#display").modal()
    }
}