var express = require('express');
var router = express.Router();
const archiver = require('archiver');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const unzipper = require('unzipper');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { spawn } = require('child_process');


const mongoUri="mongodb://mongoDB:27017/projetoEW";
const mongoContainer="mongoDB"
const uploadPath = './uploads';


// Função para exportar o banco de dados MongoDB
function exportMongoDB(callback) {
  const dumpCommand = `mongodump --uri=${mongoUri} --out ./backup/mongo`;

  const child = spawn(dumpCommand, { shell: true });

  // Captura a saída stdout
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Captura a saída stderr
  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Trata eventos de fechamento do processo
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Erro ao exportar o banco de dados. Código de saída: ${code}`);
      callback(new Error(`Erro ao exportar o banco de dados. Código de saída: ${code}`));
    } else {
      console.log('Exportação do MongoDB concluída com sucesso.');
      callback(null); // Chamada de volta sem erros
    }
  });

  // Trata erros no processo
  child.on('error', (err) => {
    console.error(`Erro ao executar o comando mongodump: ${err.message}`);
    callback(err);
  });
}

// Função para compactar a pasta FileStore e a exportação do MongoDB em um único arquivo ZIP
function zipBackup(outputPath, callback) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    console.log(`${archive.pointer()} bytes total foram escritos no arquivo ZIP.`);
    callback(null);
  });

  archive.on('error', (err) => {
    console.error(`Erro ao criar arquivo ZIP: ${err}`);
    callback(err);
  });

  archive.pipe(output);
  archive.directory('./FileStore', 'FileStore');
  archive.directory('./backup/mongo', 'mongo');
  archive.finalize();
}




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Rota para exportar dados
router.get('/export', (req, res) => {
  // Criar diretório de backup se não existir
  if (!fs.existsSync('./backup')) {
    fs.mkdirSync('./backup');
  }

  // Exportar MongoDB e compactar FileStore
  exportMongoDB((err) => {
    if (err) {
      return res.status(500).send('Erro ao exportar banco de dados');
    }
    const zipPath = './backup/full_backup.zip';
    zipBackup(zipPath, (err) => {
      if (err) {
        return res.status(500).send('Erro ao criar arquivo ZIP');
      }

      // Enviar o arquivo ZIP para download
      res.download(zipPath, 'full_backup.zip', (err) => {
        if (err) {
          console.error(`Erro ao enviar arquivo ZIP: ${err}`);
        }
        // Limpar diretórios de backup após o download
        fs.rmSync('./backup', { recursive: true, force: true });
      });
    });
  });
});





// Rota para importar dados
router.post('/import', upload.single('zip'),async (req, res) => {
  // Criar diretório de uploads se não existir
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  try {
    // Verificar se há arquivo enviado
    if (!req.files === 0) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }
    if (fs.existsSync("./FileStore")) {
       fs.rmSync("./FileStore", { recursive: true, force: true });
    }
    // Salvar o arquivo no diretório de uploads
    const zipFilePath = __dirname + "/../uploads/"+ req.file.filename //path.join(uploadPath, uploadedFile.filename);
    //console.log("aqui")
    //await uploadedFile.mv(zipFilePath);

    // Extrair o conteúdo do arquivo ZIP
    await fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: './uploads/extracted' }))
      .promise();
    // Copiar a pasta FileStore para o destino desejado na API
    
    if (fs.existsSync('./uploads/extracted/FileStore')) { 
      fs.renameSync('./uploads/extracted/FileStore', __dirname + "/../FileStore");
    }
    // Caminho completo para o diretório 'mongo' dentro do ZIP extraído
    const mongoBackupPath = __dirname +"/../uploads/extracted/mongo/projetoEW";



    // Comando para restaurar os dados do MongoDB dentro do container Docker

    const restoreCommand = `mongorestore --uri=${mongoUri} --drop ${mongoBackupPath}`;

    // Executar o comando de restauração dentro do container Docker
    exec(restoreCommand, (restoreErr, restoreStdout, restoreStderr) => {
      if (restoreErr) {
        console.error(`Erro ao restaurar MongoDB: ${restoreStderr}`);
        return res.status(500).send('Erro ao restaurar MongoDB');
      }
      console.log('Restauração do MongoDB concluída.');

      // Remover o arquivo ZIP e diretório temporário de uploads
      fs.unlinkSync(zipFilePath);
      fs.rmSync("./uploads/extracted", { recursive: true, force: true });

      res.send('Importação concluída com sucesso!');
    });
      
    
  } catch (err) {
    console.error(`Erro durante a importação: ${err}`);
    res.status(500).send('Erro durante a importação');
  }
});

module.exports = router;
