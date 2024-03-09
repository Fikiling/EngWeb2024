import json

def pertence_P(valor, lista):   
    encotrado = False
    i = 0
    while i < len(lista) and not encotrado:
        if lista[i]['Designacao'] == valor:
            encotrado = True
        i += 1

    return encotrado

def make_periods(data):
    periods = []
    contador = 1

    for compositor in data:
        p = compositor['periodo']
        
        if not pertence_P(p, periods):
            periods.append({
                "id": f'P{contador}',
                "Designacao": p,
            })
            contador += 1       

    return periods

periodos = []

with open("compositores.json", "r") as file:
    data = json.load(file)
    
periodos = make_periods(data["compositores"])

myDB = {
    "Compositores": data["compositores"],
    "Periodos": periodos
}

f = open("myDB.json", "w")
json.dump(myDB, f, indent=4)