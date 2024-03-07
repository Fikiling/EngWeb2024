exports.genrePage = function(genre){
    var pagHTML = `
    <html>
    <head>
        <title>Gênero: ${genre.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
        <style>
            .genre-header {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
            }
            .genre-container {
                padding: 20px;
            }
            .genre-footer {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="genre-header">
                <h1>Gênero ${genre.id}</h1>
            </header>

            <div class="genre-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Designação: </b> ${genre.Designacao}</li>
                    <li><b>ID: </b> ${genre.id}</li>
                    <li><b>Filmes:</b>
                        <ul>`;
    genre.Filmes.forEach(filme => {
        pagHTML += `<li>${filme.Nome}</li>`;
    });

    pagHTML += `</ul></li>
                </ul>
            </div>
    
            <footer class="genre-footer">
                <address>Gerado por EngWeb2024 - [<a href="/generos">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `;
    return pagHTML;
};

exports.moviePage = function(movie) {
    var pagHTML = `
    <html>
    <head>
        <title>Filme: ${movie.title}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
        <style>
            .movie-header {
                background-color: #2196F3;
                color: white;
                padding: 10px;
                text-align: center;
            }
            .movie-container {
                padding: 20px;
            }
            .movie-footer {
                background-color: #2196F3;
                color: white;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="movie-header">
                <h1>${movie.title}</h1>
            </header>

            <div class="movie-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Título: </b> ${movie.title}</li>
                    <li><b>Ano: </b> ${movie.year}</li>
                    <li><b>Gêneros:</b>
                        <ul>`;
    movie.genres.forEach(genre => {
        pagHTML += `<li>${genre}</li>`;
    });

    pagHTML += `</ul></li>
                    <li><b>Elenco:</b>
                        <ul>`;
    movie.cast.forEach(actor => {
        pagHTML += `<li>${actor}</li>`;
    });

    pagHTML += `</ul></li>
                </ul>
            </div>
    
            <footer class="movie-footer">
                <address>Gerado por EngWeb2024 - [<a href="/filmes">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `;
    return pagHTML;
};

exports.actorPage = function(actor){
    var pagHTML = `
    <html>
    <head>
        <title>Ator: ${actor.Nome}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
        <style>
            .actor-header {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
            }
            .actor-container {
                padding: 20px;
            }
            .actor-footer {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="actor-header">
                <h1>Ator ${actor.Nome}</h1>
            </header>

            <div class="actor-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Nome: </b> ${actor.Nome}</li>
                    <li><b>ID: </b> ${actor.id}</li>
                    <li><b>Filmes:</b>
                        <ul>`;
    actor.Filmes.forEach(filme => {
        pagHTML += `<li>${filme.Nome}</li>`;
    });

    pagHTML += `</ul></li>
                </ul>
            </div>
    
            <footer class="actor-footer">
                <address>Gerado por EngWeb2024 - [<a href="/atores">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `;
    return pagHTML;
};
