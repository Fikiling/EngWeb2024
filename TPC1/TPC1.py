import os 
from xml.etree import ElementTree as ET
from lxml import etree


os.mkdir('html')
html_folder = "html/"

xml_folder = "../../Sets/MapaRuas-materialBase/texto"
xsd_path = "../../Sets/MapaRuas-materialBase/MRB-rua.xsd"


def validate_xml(xml_path, xsd_path):
    try:
        with open(xsd_path, 'r') as xsd_file:
            schema = etree.XMLSchema(etree.parse(xsd_file))
        with open(xml_path, 'r') as xml_file:
            xml = etree.parse(xml_file)
        schema.assertValid(xml)
        return True
    except etree.XMLSchemaError as e:
        print(f"Erro no esquema XSD: {e}")
        return False
    except etree.DocumentInvalid as e:
        print(f"Documento XML inválido: {e}")
        return False


html = '''
<!DOCTYPE html>
<html>
<head>
    <title> EngWeb2023</title>
    <meta charset="UTF-8">

</head>
<body>
'''

template = html
html += '<ul>'

info_ruas = []
for xml_filename in os.listdir(xml_folder):
    if xml_filename.endswith ('.xml'):
        xml_path = os.path.join(xml_folder, xml_filename)
        if validate_xml(xml_path, xsd_path):
            tree = ET.parse(xml_path)
            root = tree.getroot()
             
            
            nome_rua = root.find("./meta/nome").text
            numero_rua = root.find("./meta/número").text
            descricao = ""
            for para_elem in root.findall("./corpo/para"):
                if para_elem.text is not None:
                    descricao += para_elem.text.strip() + " "

            

            casas = []
            for casa_elem in root.findall("./corpo/lista-casas/casa"):
                numero_elem = casa_elem.find("número")
                numero = numero_elem.text if numero_elem is not None else "N/A"
                
                enfiteuta_elem = casa_elem.find("enfiteuta")
                enfiteuta = enfiteuta_elem.text if enfiteuta_elem is not None else "N/A"
                
                foro_elem = casa_elem.find("foro")
                foro = foro_elem.text if foro_elem is not None else "N/A"
                
                desc_casa = ""
                desc_elem = casa_elem.find("desc")
                if desc_elem is not None:
                    for para_elem in desc_elem.findall("para"):
                        desc_text = para_elem.text
                        if desc_text is not None:
                            desc_casa += desc_text.strip() + " "
                
                casas.append({"numero": numero, "enfiteuta": enfiteuta, "foro": foro, "desc": desc_casa})


            imagens = []
            for figura_elem in root.findall("./corpo/figura"):
                imagem_path = figura_elem.find("imagem").get("path")
                legenda = figura_elem.find("legenda").text
                imagens.append({"path": imagem_path, "legenda": legenda})

            templateRua = template 
            templateRua += f'<h1> {nome_rua} </h1>' 
            templateRua += f'<h3><b> Número de Rua: {numero_rua} </b></h3>'
            templateRua += f'<h3><b> Lista de Casas: </b></h3>'
            for casa in casas:
                templateRua += "<div>"
                templateRua += f"<p>Casa com o número: {casa['numero']}</p>"
                templateRua += f"<p>Donos da casa: {casa['enfiteuta']}</p>"
                templateRua += f"<p>Foro: {casa['foro']}</p>"
                templateRua += f"<p>Descrição: {casa['desc']}</p>"
                templateRua += "</div>"

            templateRua += f'<p><b>Descrição:</b> {descricao} </p>'
            for imagem_info in imagens:
                templateRua += f'<img src="{imagem_info["path"]}" alt="{imagem_info["legenda"]}">'
                templateRua += f'<p>{imagem_info["legenda"]}</p>'
            templateRua += f"<h6><a href='../mapa_sorted_linked.html'>Voltar</a></h6>"
            templateRua += "</body>"
            templateRua += "</html"

            info_ruas.append(nome_rua)

            fileRua = open(f"html/{nome_rua}.html", "w", encoding="utf-8")
            fileRua.write(templateRua)
            fileRua.close()
    
for elem in sorted(info_ruas):
    html += f'<li><a href="html/{elem}.html">{elem}</li>'



html += "</ul>"
html += "</body>"
html += "</hmtl>"

file = open("mapa_sorted_linked.html", "w", encoding="utf-8")
file.write(html)
file.close()



            

