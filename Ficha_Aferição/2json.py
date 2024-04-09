import json
import os

cont = 14001
result = []

os.chdir('./sets')

with open('dataset-extra3.json') as f:
    data = json.load(f)
    for elem in data:
        elem['_id'] = str(cont)  # Adiciona o campo _id
        result.append(elem)
        cont += 1

# Escreve o resultado de volta ao arquivo JSON
with open('dataset-extra3.json', 'w') as f:
    json.dump(result, f, indent=2)
