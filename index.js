const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talkerJSON = './talker.json';
const encoding = 'utf-8';

app.get('/talker', async (_req, res) => {
  const talkerFS = await fs.readFile(talkerJSON, encoding)
    .then((fileName) => JSON.parse(fileName))
    .catch((err) => res.status(200).json(err));
  res.status(200).json(talkerFS);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talkerID = await fs.readFile(talkerJSON, encoding)
    .then((fileContent) => JSON.parse(fileContent));

  const talker = talkerID.find((talk) => talk.id === +id); 

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talker);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
