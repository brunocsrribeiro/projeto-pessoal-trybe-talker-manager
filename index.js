const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const { generatedToken, validatedEmail, validatedPassword } = require('./authMiddleware');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const TALKER_JSON = './talker.json';
const STANDARD_UNICODE = 'utf-8';

app.get('/talker', async (_request, response) => {
  const talkerFS = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileName) => JSON.parse(fileName))
    .catch((err) => response.status(200).json(err));
  response.status(200).json(talkerFS);
});

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;

  const talkerID = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileContent) => JSON.parse(fileContent));

  const talker = talkerID.find((talk) => talk.id === +id); 

  if (!talker) return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  response.status(200).json(talker);
});

app.post('/login', (request, response) => {
  const { email, password } = request.body;
  const token = generatedToken();

  const validEmail = validatedEmail(email);
  const validPassword = validatedPassword(password);
  
  if (validEmail) response.status(400).json({ message: validEmail });

  if (validPassword) response.status(400).json({ message: validPassword });

  response.status(200).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
