import express from 'express';
import { promises as fs } from 'fs';
const router = express.Router();

const dateTime = new Date();

router.get('/', async (req, res) => {
  try {
    const bodyData = req.body;
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    const obj = {
      id: data.nextId,
      student: bodyData.student,
      subject: bodyData.subject,
      type: bodyData.type,
      value: bodyData.value,
      timestamp: dateTime.toJSON(),
    };

    data.grades.push(obj);
    data.nextId++;
    await fs.writeFile(global.fileName, JSON.stringify(data, null, 2), 'utf-8');

    res.send(data);
    //res.send(`<p>${JSON.stringify(bodyData, null, ' ')}</p>`);
  } catch (error) {
    console.log(error);
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    const bodyData = req.body;
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    const obj = data.grades.findIndex((infos) => {
      return infos.id === parseInt(req.params.id);
    });

    if (obj === -1) {
      throw new Error('Id Inválido');
    }
    console.log(bodyData.student);
    console.log(data.grades[obj].student);
    data.grades[obj].student = bodyData.student;
    data.grades[obj].subject = bodyData.subject;
    data.grades[obj].type = bodyData.type;
    data.grades[obj].value = bodyData.value;

    await fs.writeFile(global.fileName, JSON.stringify(data, null, 2), 'utf-8');
    res.send(data.grades[obj]);
  } catch (error) {
    console.log(error);
  }
});
export default router;
