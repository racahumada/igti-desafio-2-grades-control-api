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
    res.end();
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
    res.end();
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    const obj = data.grades.filter((infos) => {
      return infos.id !== parseInt(req.params.id);
    });
    data.grades = obj;
    await fs.writeFile(global.fileName, JSON.stringify(data, null, 2), 'utf-8');
    res.send(data);
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/searchgrade/:id', async (req, res) => {
  try {
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    console.log(req.params.id);

    const obj = data.grades.find((infos) => {
      return infos.id === parseInt(req.params.id);
    });
    if (obj === undefined) {
      throw new Error('Id Inválido');
    }
    res.send(obj);
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/searchstudent?', async (req, res) => {
  try {
    let soma = 0;
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    console.log(req.query.student);
    console.log(req.query.subject);
    const obj = data.grades.filter((list) => {
      return (
        list.student === req.query.student && list.subject === req.query.subject
      );
    });
    for (const student of obj) {
      soma += student.value;
    }
    res.send(`Valor da Nota: ${soma}`);
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/media?', async (req, res) => {
  try {
    let media = 0;
    console.log(req.query.subject);
    console.log(req.query.type);
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    const objs = data.grades.filter((infos) => {
      return (
        infos.subject === req.query.subject && infos.type === req.query.type
      );
    });
    for (const obj of objs) {
      media += obj.value;
    }

    media = media / objs.length;
    res.send(`Média Geral: ${media}`);
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/bestvalue?', async (req, res) => {
  try {
    const dataJson = await fs.readFile(global.fileName);
    const data = JSON.parse(dataJson);
    const objs = data.grades
      .filter((infos) => {
        return (
          infos.subject === req.query.subject && infos.type === req.query.type
        );
      })
      .sort((a, b) => {
        return b.value - a.value;
      });
    const retornar = [];
    for (let count = 0; count < 3; count++) {
      retornar.push(objs[count]);
    }
    res.send(retornar);
  } catch (error) {
    console.log(error);
    res.end();
  }
});

export default router;
