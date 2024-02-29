import json
import os


def getNome(id):
    for cidade in content['cidades']:
        if cidade['id'] == id:
            return cidade['nome']
    return None

html= '''
<!DOCTYPE html>
<html>
<head>
    <title> EngWeb2024 TPC2</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="w3.css"/>

</head>
<body>
    <h1><b>Mapa Virtual</b></h1>
''' 

if not os.path.exists('html'):
    os.mkdir('html')

with open('mapa-virtual.json', 'r', encoding='utf-8') as file:
    content = json.load(file)

template = html
html += '<ul class="w3-ul w3-hoverable">'



ligacoes = {}
for ligacao in content['ligacoes']:
    nome_destino = getNome(ligacao['destino'])
    tuplo = (nome_destino, ligacao['distância'])
    
    if ligacao['origem'] in ligacoes:
        ligacoes[ligacao['origem']].append(tuplo)  
    else:
        ligacoes[ligacao['origem']] = [tuplo]


listaCidades = []
for cidade in content['cidades']:
    listaCidades.append(cidade['nome'])
    
    
    templateCidade = template
    templateCidade += f'<h1>Nome: {cidade["nome"]}</h1>'
    templateCidade += f'<h3>ID Cidade: {cidade["id"]}</h3>'
    templateCidade += f'<p><b>Distrito: {cidade["distrito"]}</b></p>'
    templateCidade += f'<p><b>Descrição: {cidade["descrição"]}</b></p>'
    templateCidade += f'<p><b>População: {cidade["população"]}</b></p>'
    if cidade['id'] in  ligacoes:
        lista_tuplos = ligacoes[cidade['id']]
        for elem in lista_tuplos:
            cidade_nome= elem[0]
            distancia = elem[1]
            templateCidade += f'<p><b>Caminho para: <a href="{cidade_nome}.html" style="text-decoration: none;">{cidade_nome}</a>  - Distância: {distancia}</b></p>'

    templateCidade += f'<h6><a href="../index.html">Voltar à página principal</a></h6>'
    templateCidade += '</body>'
    templateCidade += '</html>'

    fileCidade = open(f'html/{cidade["nome"]}.html', 'w', encoding='utf-8')
    fileCidade.write(templateCidade)
    fileCidade.close()

for elem in sorted(listaCidades):
    html += f'<li class="w3-hover-green"><a href="html/{elem}.html" style="text-decoration: none;">{elem}</li>'   

html += '</ul>'
html += '</body>'
html += '</html>'

file = open('index.html', 'w', encoding='utf-8')
file.write(html)
file.close()