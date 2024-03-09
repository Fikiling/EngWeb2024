exports.compositoresListPage = function(compositores, d) {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .w3-card-4 {
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .w3-card-4 header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between; /* Alinha os elementos à direita e à esquerda */
                    align-items: center; /* Centraliza verticalmente os elementos */
                }
                .w3-card-4 footer {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                tr:hover {
                    background-color: #f2f2f2;
                }
                .bio {
                    max-width: 600px;
                    max-height: 100px; /* Define a altura máxima da bio */
                    overflow-y: auto; /* Ativa a barra de rolagem vertical */
                    overflow-x: hidden; /* Desativa a barra de rolagem horizontal */
                    white-space: pre-line; /* Faz com que as quebras de linha sejam respeitadas */
                }
                .btn-add {
                    background-color: #ffffff;
                    color: #000000;
                    border: none;
                    padding: 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .btn-add:hover {
                    background-color: #ffffff; /* Muda a cor de fundo quando o mouse está sobre o botão */
                    color: #000000; /* Muda a cor do texto quando o mouse está sobre o botão */
                }
                .plus-sign {
                    font-size: 24px;
                    vertical-align: middle;
                }
        </style>
        <title>Gestão de Compositores</title>
    </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container">
                    <h1>Compositors List</h1>
                    <a class="w3-btn w3-round w3-green btn-add" href="/Compositores/registo">
                        Adicionar elemento
                        <div class="plus-sign">+</div>
                    </a>
                </header>
                <div class="w3-container">
                    <table>
                        <tr>
                            <th style="width: 5%;">Id</th>
                            <th style="width: 20%;">Nome</th>
                            <th style="width: 40%;">Bio</th>
                            <th style="width: 10%;">DataNasc</th>
                            <th style="width: 10%;">DataObito</th>
                            <th style="width: 10%;">Periodo</th>
                            <th style="width: 5%;">Actions</th>
                        </tr>
                `;

    for(let i=0; i < compositores.length; i++){
        pagHTML += `
                <tr>
                    <td>
                        <a href="/Compositores/${compositores[i].id}">${compositores[i].id}</a>
                    </td>
                    <td>${compositores[i].nome}</td>
                    <td><div class="bio" title="${compositores[i].bio}">${compositores[i].bio}</div></td>
                    <td>${compositores[i].dataNasc}</td>
                    <td>${compositores[i].dataObito}</td>
                    <td><a href="/Periodos">${compositores[i].periodo}</a></td>
                    <td>
                        [<a href="/Compositores/edit/${compositores[i].id}">Edit</a>][<a href="/Compositores/delete/${compositores[i].id}">Delete</a>]
                    </td>
                </tr>
        `;
    }

    pagHTML += `
                    </table>
                </div>
                <footer class="w3-container">
                    <h5>Generated by a100696 in ${d}</h5>
                </footer>
            </div>
        </body>
    </html>
    `;
    return pagHTML;
}

exports.compositorPage = function(compositor, d) {
    var pagHTML = `
    <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compositor: ${compositor.id}</title>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
        }
        .bio {
            white-space: pre-line;
        }
        .footer {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Compositor ${compositor.id}</h1>
        </header>

        <div class="w3-container">
            <ul class="w3-ul" style="width: 50%;">
                <li><b>Nome:</b> ${compositor.nome}</li>
                <li><b>Id:</b> ${compositor.id}</li>
                <li><b>Data de Nascimento:</b> ${compositor.dataNasc}</li>
                <li><b>Data de Óbito:</b> ${compositor.dataObito}</li>
                <li><b>Período:</b> ${compositor.periodo}</li>
                <li><b>Bio:</b> <span class="bio">${compositor.bio}</span></li>
            </ul>
        </div>

        <footer class="footer">
            <address>Gerado por a100696::EngWeb2024 em ${d} - [<a href="/">Voltar</a>]</address>
        </footer>
    </div>
</body>
</html>

    `;
    return pagHTML;
}

exports.compositorFormPage = function(d) {
    var pagHTML = `
    <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compositor Form</title>
    <link rel="icon" href="favicon.png"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #800080;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
        }
        .form-container {
            padding: 20px;
        }
        .footer {
            background-color: #800080;
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h2>Composer Form</h2>
        </header>

        <div class="form-container">
            <form class="w3-container" method="POST">
                <fieldset>
                    <legend>Metadata</legend>
                    <label>Id</label>
                    <input class="w3-input w3-round" type="text" name="id" required>
                    <label>Name</label>
                    <input class="w3-input w3-round" type="text" name="nome" required>
                    <label>Data de Nascimento</label>
                    <input class="w3-input w3-round" type="date" name="dataNasc" required>
                    <label>Data de Óbito</label>
                    <input class="w3-input w3-round" type="date" name="dataObito">
                    <label>Período</label>
                    <input class="w3-input w3-round" type="text" name="periodo">
                    <label>Bio</label>
                    <textarea class="w3-input w3-round" name="bio" rows="5" required></textarea>
                </fieldset>

                <br>
                <button class="w3-btn w3-purple w3-mb-2" type="submit">Register</button>
            </form>
        </div>

        <footer class="footer">
            <h5>Generated by a100696::EngWeb2024 in ${d} - [<a href="/">Regressar</a>]</h5>
        </footer>
    </div>
</body>
</html>
    `;
    return pagHTML;
}

exports.compositorFormEditPage = function(compositor, d) {
    var pagHTML = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" href="favicon.png"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <title>Compositor Form</title>
    <style>
        body {
            background-color: #f8f9fa; /* Cor de fundo mais leve */
        }
        .container {
            width: 50%;
            margin: 0 auto;
            padding-top: 30px;
        }
        .card-header {
            background-color: #007bff; /* Azul leve */
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .form-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .form-container input[type=text], 
        .form-container input[type=date], 
        .form-container textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 16px;
            resize: vertical;
        }
        .form-container button {
            background-color: #007bff; /* Azul leve */
            color: white;
            padding: 14px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        .form-container button:hover {
            background-color: #0056b3; /* Azul mais escuro no hover */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="w3-card-4">
            <div class="card-header">
                <h2>Compositor Form</h2>
            </div>
        
            <form class="form-container" method="POST">
                <fieldset>
                    <legend>Metadata</legend>
                    <label>ID</label>
                    <input type="text" name="id" readonly value="${compositor.id}"/>
                    <label>Name</label>
                    <input type="text" name="nome" value="${compositor.nome}"/>
                    <label>Bio</label>
                    <textarea name="bio">${compositor.bio}</textarea>
                    <label>Date of Birth</label>
                    <input type="date" name="dataNasc" value="${compositor.dataNasc}"/>
                    <label>Date of Death</label>
                    <input type="date" name="dataObito" value="${compositor.dataObito}"/>
                    <label>Period</label>
                    <input type="text" name="periodo" value="${compositor.periodo}"/>
                </fieldset>

                <!-- Adicione aqui campos adicionais conforme necessário -->

                <br/>
                <button type="submit">Save</button>
            </form>

            <footer class="card-header">
                <h5>Generated by a100696::EngWeb2024 in ${d} - [<a href="/">Regressar</a>]</h5>
            </footer>
        
        </div>
    </div>
</body>
</html>   
    `;
    return pagHTML;
}

exports.periodsListPage = function(p, d){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .w3-card-4 {
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .w3-card-4 header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between; /* Alinha os elementos à direita e à esquerda */
                    align-items: center; /* Centraliza verticalmente os elementos */
                }
                .w3-card-4 footer {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                tr:hover {
                    background-color: #f2f2f2;
                }
                .add-btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .add-btn:hover {
                    background-color: #45a049;
                }
            </style>
            <title>Lista de Períodos</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container">
                    <h1>Lista de Períodos</h1>
                    <a class="add-btn" href="/Periodos/registo">Adicionar Período</a>
                </header>
                <div class="w3-container">
                    <table>
                        <tr>
                            <th style="width: 20%;">ID</th>
                            <th style="width: 75%;">Designação</th>
                            <th style="width: 05%;">Actions</th>
                        </tr>
    `;

    // Loop through periods array and add rows to the table
    for(let i=0; i < p.length; i++){
        pagHTML += `
            <tr>
                <td>
                    <a href="/Periodos/${p[i].id}">${p[i].id}</a>
                </td>
                <td>${p[i].Designacao}</td>
                <td>
                    [<a href="/Periodos/edit/${p[i].id}">Edit</a>][<a href="/Periodos/delete/${p[i].id}">Delete</a>]
                </td>
            </tr>
        `;
    }

    pagHTML += `
                    </table>
                </div>
                <footer class="w3-container">
                    <h5>Generated by a100696 in ${d}</h5>
                </footer>
            </div>
        </body>
    </html>
    `;
    return pagHTML;
}

exports.periodPage = function(periodo, d){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .w3-card-4 {
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .w3-card-4 header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .w3-card-4 footer {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
            </style>
            <title>Detalhes do Período</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container">
                    <h1>Detalhes do Período</h1>
                </header>
                <div class="w3-container">
                    <table>
                        <tr>
                            <th>ID</th>
                            <td>${periodo.id}</td>
                        </tr>
                        <tr>
                            <th>Designação</th>
                            <td>${periodo.Designacao}</td>
                        </tr>
                    </table>
                </div>
                <footer class="w3-container">
                    <h5>Gerado por a100696::EngWeb2024 em ${d} - [<a href="/Periodos">Voltar</a>]</address></h5>
                </footer>
            </div>
        </body>
    </html>
    `;
    return pagHTML;
}

exports.periodFormPage = function(d) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .w3-card-4 {
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .w3-card-4 header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                }
                .w3-card-4 footer {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                }
                .w3-container {
                    padding: 0;
                }
                .w3-btn {
                    border-radius: 5px;
                }
                .w3-green {
                    background-color: #4CAF50;
                    color: white;
                }
                .w3-green:hover {
                    background-color: #45a049;
                }
                .w3-round {
                    border-radius: 4px;
                }
                .w3-input {
                    width: 100%;
                    padding: 10px;
                    margin-top: 6px;
                    margin-bottom: 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
            </style>
            <title>Period Form</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container">
                    <h2>Period Form</h2>
                </header>
            
                <form class="w3-container" method="POST">
                    <fieldset>
                        <legend>Metadata</legend>
                        <label>Id</label>
                        <input class="w3-input w3-round" type="text" name="id" required/>
                        <label>Name</label>
                        <input class="w3-input w3-round" type="text" name="nome" required/>
                    </fieldset>
  
                    <br/>
                    <button class="w3-btn w3-green w3-round w3-margin-bottom" type="submit">Salvar</button>
                </form>

                <footer class="w3-container">
                    <h5>Generated by a100696 in ${d} - [<a href="/Periodos">Voltar</a>]</h5>
                </footer>
            
            </div>
    `
}

exports.periodFormEditPage = function(periodo, d) {
    var pagHTML = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" href="favicon.png"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <title>Period Edit Form</title>
    <style>
        body {
            background-color: #f8f9fa; /* Lighter background color */
        }
        .container {
            width: 50%;
            margin: 0 auto;
            padding-top: 30px;
        }
        .card-header {
            background-color: #007bff; /* Light blue */
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .form-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .form-container input[type=text], 
        .form-container input[type=date], 
        .form-container textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-top: 6px;
            margin-bottom: 16px;
            resize: vertical;
        }
        .form-container button {
            background-color: #007bff; /* Light blue */
            color: white;
            padding: 14px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        .form-container button:hover {
            background-color: #0056b3; /* Darker blue on hover */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="w3-card-4">
            <div class="card-header">
                <h2>Period Edit Form</h2>
            </div>
        
            <form class="form-container" method="POST">
                <fieldset>
                    <legend>Metadata</legend>
                    <label>ID</label>
                    <input class="w3-input w3-round" type="text" name="id" required/>
                    <label>Designation</label>
                    <input class="w3-input w3-round" type="text" name="id" required/>
                </fieldset>

                <br/>
                <button type="submit">Save</button>
            </form>

            <footer class="card-header">
                <h5>Generated by a100696::EngWeb2024 in ${d} - [<a href="/Periodos">Back</a>]</h5>
            </footer>
        
        </div>
    </div>
</body>
</html>   
    `;
    return pagHTML;
}
