import express from 'express';
import router from './route/grade.js';
import { promises as fs } from 'fs';

//Variáveis Globais
global.fileName = 'grades.json';

const app = express();
app.use(express.json());
app.use('/', router);

app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName);
    console.log(`Arquivo: ${global.fileName} lido com sucesso!`);
  } catch (error) {
    console.log(error);
  }
});
