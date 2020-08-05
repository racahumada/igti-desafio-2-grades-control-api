import express from 'express';
import router from './route/grade.js';
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());
app.use('/', router);

app.listen(3000, () => {
  console.log('Api OK');
});
