import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('<p>Teste 2</p>');
});

export default router;
