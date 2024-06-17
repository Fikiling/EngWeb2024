# ProjetoEW
Para o nosso projeto de Engenharia Web escolhemos a proposta 1, ou seja, a criação de uma Plataforma de Gestão e Disponibilização de Recursos Educativos.

O objetivo desta plataforma é disponibilizar recursos educativos para uma vasta gama de utilizadores, os recursos são diversos podendo ser livros, artigos, entre outros recursos necessários em uma plataforma educativa.

# OAIS
No processo de ingestão, os metadados vão no req.body e os ficheiros vão num zip que juntamente são acompanhados por um manifest. Este manifest é composto pela identificação dos ficheiros que estão presentes no zip e o hash de cada ficheiro, garantindo a integridade dos mesmos.
Este manifesto é util para converter de um SIP, para um AIP, em que é posteriormente comparado com o que realmente vem no zip.
Já no processo de administração, foi desenvolvido o CRUD para todos os recursos armazenados. Neste processo também se verifica a existência de alguma diferença entre o manifesto e os ficheiros enviados, caso algo não esteje na normalidade, é enviado um JSON informativo que descreve onde na transformação de SIP para AIP deu errado.
No processo de disseminação é utilizado um DIP igual ao SIP sendo que o manifesto é recalculado com os ficheiros armazenados e os ficheiros são enviados dentro do zip. Este processo é disponibilizado através de um botão na interface responsável por dar download ao zip.


# Serviços Desenvolvidos 
## Autenticação 
Foi desenvolvido um servidor apenas responsável pela autenticação de utilizadores.
Neste serviço, é possível registar um novo utilizador (por default existe um admin já no sistema), realizar um login em que se valida as informações do user, e são disponibilizadas o CRUD para um user, sendo que são adicionadas verificações em que apenas o próprio user ou o admin consegue alterar a pass, remover do user.
Existe um campo em que é especificado o level de um user (administrador, produtor e consumidor).
O administrador consegue realizar todo o tipo de operações sobre todos os users, o produtor apenas consegue realizar operações sobre os seus recursos e o consumidor apenas vê os recursos públicos disponibilizados.
Sempre que um user é registado, o seu level é definido como consumidor e alterado para produtor sempre que adiciona o seu primeiro recurso.
Este servidor disponibiliza um middleware em que se verifica se um user tem acesso ao sistema (se está logado e se é válido), verifica se o user que está logado é o mesmo que diz ser ou se é o admin que está logado.


## API

A API desenvolvida tem como objetivo disponibilizar e gerenciar recursos educativos de diversos tipos, tais como livros, artigos, aplicações, trabalhos de alunos, monografias, relatórios, entre outros. Através desta API, os utilizadores podem adicionar, consultar, alterar e remover recursos, bem como interagir com posts relacionados aos recursos, incluindo comentários e avaliações.

### Estrutura de Dados da API de Recursos Educativos

#### Estrutura de um Post

##### Campos:

- **_id**: String - Identificador único do post.
- **descricao**: String - Descrição do post.
- **dataRegisto**: String - Data e hora de registro do post.
- **comentarios**: Array de Comentários - Lista de comentários associados ao post.
    - **autor**: String - Autor do comentário.
    - **conteudo**: String - Conteúdo do comentário.
    - **data**: String - Data do comentário.
- **likes**: Array de Strings - Lista de IDs de usuários que curtiram o post.
- **recurso**: String - ID do recurso associado ao post.

##### Exemplo de um Post:

```json
{
  "_id": "post123",
  "descricao": "Descrição do post",
  "dataRegisto": "15-06-2024 14:30:00",
  "comentarios": [
    {
      "autor": "user1",
      "conteudo": "Ótimo post!",
      "data": "15-06-2024 15:00:00"
    }
  ],
  "likes": ["user2", "user3"],
  "recurso": "recurso456"
}
```


#### Estrutura de um Recurso 

##### Campos:

- **_id**: String - Identificador único do recurso.
- **tipo**: String - Tipo do recurso (e.g., livro, artigo, aplicação).
- **titulo**: String - Título do recurso.
- **subtitulo**: String - Subtítulo do recurso.
- **dataCriacao**: String - Data de criação do recurso.
- **dataRegisto**: String - Data e hora de registro do recurso.
- **visibilidade**: String - Visibilidade do recurso (e.g., público, privado).
- **autor**: String - Autor do recurso.
- **ficheiro**: Array de Strings - Lista de nomes de arquivos associados ao recurso.
- **avaliacoes**: Array de Avaliações - Lista de avaliações do recurso.
    - **usuario_id**: String - ID do usuário que fez a avaliação.
    - **rating**: Number - Nota dada pelo usuário.

##### Exemplo de um Recurso:

```json
{
  "_id": "recurso456",
  "tipo": "livro",
  "titulo": "Título do Livro",
  "subtitulo": "Subtítulo do Livro",
  "dataCriacao": "01-01-2024",
  "dataRegisto": "15-06-2024 14:00:00",
  "visibilidade": "público",
  "autor": "autor123",
  "ficheiro": ["capitulo1.pdf", "capitulo2.pdf"],
  "avaliacoes": [
    {
      "usuario_id": "user1",
      "rating": 5
    }
  ]
}
```

### Funcionalidades

#### Gerenciamento de Recursos

- **Listagem de Recursos**: A API permite listar todos os recursos disponíveis.
- **Consulta de Recursos**: Os utilizadores podem consultar detalhes específicos de um recurso através de seu ID.
- **Criação de Recursos**: Os utilizadores podem adicionar novos recursos à plataforma. A criação envolve o upload de um arquivo ZIP contendo os recursos e um manifesto descrevendo e verificando os arquivos.
- **Atualização de Recursos**: É possível atualizar as informações de um recurso existente, incluindo o re-upload de arquivos.
- **Remoção de Recursos**: A API permite remover recursos da plataforma, incluindo a eliminação dos arquivos associados.

#### Gerenciamento de Posts

- **Listagem de Posts**: A API permite listar todos os posts disponíveis.
- **Consulta de Posts**: Os utilizadores podem consultar detalhes específicos de um post através de seu ID.
- **Criação de Posts**: Os utilizadores podem criar novos posts relacionados a recursos educativos.
- **Atualização de Posts**: É possível atualizar as informações de um post existente.
- **Remoção de Posts**: A API permite remover posts da plataforma.

#### Interação com Recursos

- **Classificação e Avaliação de Recursos**: Os utilizadores podem avaliar recursos, atribuindo estrelas e deixando feedbacks que influenciam no ranking dos mesmos.
- **Comentários em Posts**: Os utilizadores podem comentar nos posts, permitindo a troca de opiniões e discussões sobre os recursos educativos.
- **Likes em Posts**: Os utilizadores podem gostar dos posts, contribuindo para a popularidade e visibilidade dos mesmos.

#### Funcionalidades Adicionais

- **Trending Posts**: A API oferece a funcionalidade de listar os posts mais populares ou em destaque.
- **Recent Posts**: É possível listar os posts adicionados recentemente.
- **Melhores Recursos**: A API permite listar os recursos mais bem avaliados pelos utilizadores.
- **Download de Recursos**: Os utilizadores podem fazer o download dos arquivos associados a um recurso específico, incluindo um arquivo ZIP com todos os componentes e um manifesto de verificação.


## Interface

### Descrição Geral

A interface desenvolvida utiliza o framework Express.js e várias bibliotecas adicionais, como axios para realizar requisições HTTP e multer para manipulação de uploads de arquivos. Esta interface tem como objetivo fornecer funcionalidades para a gestão e disponibilização de recursos educativos, incluindo registro de usuários, login, logout, visualização e interação com posts, e upload e avaliação de recursos.

### Funcionalidades

#### Autenticação e Autorização

1. **Registo de Usuários**
   - Os usuários podem se registrar na plataforma fornecendo informações como nome de usuário, senha, nome, email e filiação. Existem validações disponibilizadas pelo serviço de autenticação para garantir que todos os campos necessários sejam preenchidos.

2. **Login de Usuários**
   - Os usuários podem fazer login na plataforma utilizando seu nome de usuário e senha. Após o login bem-sucedido, um token é armazenado nos cookies para manter a sessão do usuário ativa.

3. **Logout de Usuários**
   - Os usuários podem fazer logout, o que limpará o token de autenticação dos cookies e redirecionará o usuário para a página inicial.

#### Gestão de Posts

1. **Visualização de Posts**
   - Os usuários podem visualizar posts na página principal. Estes posts são recuperados de um serviço externo e exibidos na interface.

2. **Adicionar Posts**
   - Os usuários podem adicionar novos posts fornecendo uma descrição e um recurso associado. Há validações para garantir que os campos necessários sejam preenchidos e que o recurso exista na base de dados.

3. **Curtir Posts**
   - Os usuários podem curtir ou remover o like de posts. A lista de usuários que curtiram o post é atualizada conforme as ações dos usuários.

4. **Comentar em Posts**
   - Os usuários podem adicionar comentários em posts. Cada comentário inclui o nome do autor, conteúdo e a data/hora do comentário.

#### Gestão de Recursos

1. **Visualização de Recursos**
   - Os usuários podem visualizar a lista de recursos disponíveis. Cada recurso inclui detalhes como o autor e avaliações.

2. **Adicionar Recursos**
   - Os usuários podem fazer upload de novos recursos. Os arquivos são movidos para um diretório temporário, os hashes são calculados, e os arquivos são compactados em um arquivo ZIP antes de serem enviados para um serviço externo.

3. **Download de Recursos**
   - Os usuários podem fazer download de todos os arquivos de um recurso específico em um arquivo ZIP.

4. **Avaliação de Recursos**
   - Os usuários podem avaliar recursos, fornecendo uma nota/rating. Se o usuário já tiver avaliado o recurso, sua avaliação anterior será atualizada.

#### Página Inicial
Nesta página inicial, são apresentadas as notícias sobre o estado do sistema, aparecendo então um feed em que é possível visualizar os posts que estão nas tendências (5 posts com mais likes na última semana), são apresentados os 5 recursos com melhores avaliações de sempre e por fim apresentados os 10 útlimos posts adicionados ao sistema no momento. 


#### Exportação 


1. **Criação do Backup do MongoDB**:
   - Utilizamos o comando `mongodump` para criar um backup do banco de dados MongoDB.
   - O comando é executado através de `child_process.spawn`, que cria um processo filho para rodar o comando `mongodump`.
   - O backup é salvo na pasta `./backup/mongo`.

2. **Compactação dos Dados**:
   - A pasta `FileStore` e o backup do MongoDB são compactados em um arquivo ZIP utilizando a biblioteca `archiver`.
   - O arquivo ZIP é salvo no caminho `./backup/full_backup.zip`.

3. **Download do Arquivo ZIP**:
   - Após a criação do arquivo ZIP, ele é enviado para o usuário para download.
   - Após o download, a pasta de backup é removida para limpar o ambiente.


#### Importação

1. **Upload do Arquivo ZIP**:
   - O arquivo ZIP contendo os dados a serem importados é enviado através de um formulário utilizando `multer` para tratar o upload do arquivo.
   - O arquivo ZIP é salvo na pasta `./uploads`.

2. **Extração do Arquivo ZIP**:
   - O conteúdo do arquivo ZIP é extraído utilizando a biblioteca `unzipper`.
   - A extração ocorre na pasta `./uploads/extracted`.

3. **Restauração dos Dados**:
   - A pasta `FileStore` é movida para o local desejado.
   - Os dados do MongoDB são restaurados utilizando o comando `mongorestore`, que é executado através de `child_process.exec`.
   - Após a restauração, o arquivo ZIP e o diretório temporário são removidos.


# Docker Compose 

Para gerenciar todos os serviços , foi utilizado o docker-compose que permite orquestrar todos os serviços desenvolvidos num ambiente consistente de forma rápida. Para tal, foi desenvolvido um Dockerfile para cada serviço, e um docker-compose.yml para criar os respetivos contentores a partir das imagens geradas com base nos Dockerfiles respetivos. Este docker-compose, está definido tendo em conta as dependências entre os serviços.

Este docker-compose.yml é resposável por criar 4 containers, um para cada serviço da aplicaçao:
- **container-interface**: contentor responsável pelo serviço da interface (porta 29051).
- **container-api**: contentor responsável pelo serviço da API de dados (porta 29050).
- **container-authentication**: contentor responsável pelo serviço de autenticação (porta 29052).
- **container-mongoDB**: contentor responsável pelo serviço de base de dados mongoDB (porta default 27017).

*Nota*: O dockerfile da api executa uma série de comandos adicionais para conseguir instalar o mongodb-tools, para conseguir executar os comandos de `mongodump` e `mongorestore` dentro do contentor criado.


