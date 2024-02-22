import os 
from xml.etree import ElementTree as ET

def validate_xml(xml_path):
    xml_tree = ET.parse(xml_path)
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

file = open("mapa.json", "r", encoding="utf-8").read()
os.mkdir("html")

xml_folder = "../../Sets/MapaRuas-materialBase/texto"
html_folder = "html/"

nomes_ruas = []
for xml_filename in os.listdir(xml_folder):
    if xml_filename.endswith ('.xml'):
        xml_path = os.path.join(xml_folder, xml_filename)


html += "<ul>"