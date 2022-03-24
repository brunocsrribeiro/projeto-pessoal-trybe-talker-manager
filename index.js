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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
