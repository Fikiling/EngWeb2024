import json


def pertence_G(valor, lista):   
    encotrado = False
    i = 0
    while i < len(lista) and not encotrado:
        if lista[i]['Designacao'] == valor:
            encotrado = True
        i += 1

    return encotrado

def make_genres(filmes):
    genres = []
    contador = 1

    for filme in filmes:
        for genre in filme['genres']:
            if not pertence_G(genre, genres):
                genres.append({
                    "id": f'g{contador}',
                    "Designacao": genre,
                    "Filmes": [{"F_id": filme['_id'], "Nome": filme['title']}]
                })
                contador += 1
            else:
                for g in genres:
                    if g['Designacao'] == genre:
                        g['Filmes'].append({"F_id": filme['_id'], "Nome": filme['title']})
                

    return genres

def pertence_A(valor, lista):   
    encotrado = False
    i = 0
    while i < len(lista) and not encotrado:
        if lista[i]['Nome'] == valor:
            encotrado = True
        i += 1

    return encotrado
def make_actors(filmes):
    actors = []
    contador = 1

    for filme in filmes:
        for actor in filme['cast']:
            if not pertence_A(actor, actors):
                actors.append({
                    "id": f'a{contador}',
                    "Nome": actor,
                    "Filmes": [{"F_id": filme['_id'], "Nome": filme['title']}]
                })
                contador += 1
            else:
                for a in actors:
                    if a['Nome'] == actor:
                        a['Filmes'].append({"F_id": filme['_id'], "Nome": filme['title']})
            
    return actors

def make_movies(filmes):
    movies = []
    
    
    for filme in filmes:
        if 'title' in filme and 'year' in filme and 'genres' in filme and 'cast' in filme:
            filme_id = filme['_id']['$oid']
            movies.append({
                "id": filme_id,
                "title": filme['title'],
                "year": filme['year'],
                "genres": filme['genres'],
                "cast": filme['cast']
            })
        

    return movies

filmes = []
with open('filmes.json', 'r') as file:
    for line in file:
        # Remova espaços em branco e quebras de linha do início e do final da linha
        line = line.strip()
        # Se a linha não estiver vazia, adicione-a à lista de filmes
        if line:
            filme = json.loads(line)
            if 'title' in filme and 'year' in filme and 'genres' in filme and 'cast' in filme:
                filmes.append(filme)

genres = []
actors = []
movies = []

genres = make_genres(filmes)
actors = make_actors(filmes)
movies = make_movies(filmes)

myDB = {
    "Movies": movies,
    "Genres": genres,
    "Actors": actors
}
f = open("myDB.json", "w")
json.dump(myDB, f, indent=4)



