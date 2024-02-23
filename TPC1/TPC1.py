import os 
from xml.etree import ElementTree as ET


os.mkdir('html')
html_folder = "html/"

xml_folder = "../../Sets/MapaRuas-materialBase/texto"
xsd_path = "../../Sets/MapaRuas-materialBaseMRB-rua.xsd"


def validate_xml(xml_path):
    xml_tree = ET.parse(xml_path)
    xsd_root = ET.parse(xsd_path).getroot()  
    xml_schema = ET.XMLSchema(xsd_root)
    return xml_schema.validate(xml_tree)


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

info_ruas = {}
for xml_filename in os.listdir(xml_folder):
    if xml_filename.endswith ('.xml'):
        xml_path = os.path.join(xml_folder, xml_filename)
        if validate_xml(xml_path):
            tree = ET.parse(xml_path)
            root = tree.getroot()
             

            nome_rua = root.find("./meta/nome").text
            descricao = root.find("./corpo/para").text
            populacao = root.find("./meta/população").text

            casas = []
            for casa_elem in root.findall("./corpo/lista-casas/casa"):
                numero = casa_elem.find("número").text
                enfiteuta = casa_elem.find("enfiteuta").text
                foro = casa_elem.find("foro").text
                desc = casa_elem.find("desc").text
                casas.append({"numero": numero, "enfiteuta": enfiteuta, "foro": foro, "desc": desc})

            
            info_ruas[nome_rua] = {
                "nome": nome_rua,
                "descricao": descricao,
                "populacao": populacao,
                # Adicione aqui quaisquer outras informações que desejar extrair do XML
                "casas": casas
            }

for elem in info_ruas
            



with open("mapa_ruas.html", "w", encoding="utf-8") as main_html_file:
    
    main_html_file.write(html_content)





html += "<ul>"