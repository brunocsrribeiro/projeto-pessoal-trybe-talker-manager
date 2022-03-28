const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const { generatedToken, validatedEmail,
  validatedPassword, isValidToken,
  isValidTalk, isValidDateAndRate,
  isValidName, isValidAge } = require('./authMiddleware');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const TALKER_JSON = './talker.json';
const STANDARD_UNICODE = 'utf-8';

app.get('/talker', async (_req, res) => {
  const talkerFS = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileName) => JSON.parse(fileName))
    .catch((err) => res.status(200).json(err));
  res.status(200).json(talkerFS);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talkerID = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileContent) => JSON.parse(fileContent));

  const talker = talkerID.find((talk) => talk.id === +id); 

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talker);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = generatedToken();

  const validEmail = validatedEmail(email);
  const validPassword = validatedPassword(password);
  
  if (validEmail) res.status(400).json({ message: validEmail });

  if (validPassword) res.status(400).json({ message: validPassword });

  res.status(200).json({ token });
});

app.use(isValidToken);
app.use(isValidTalk);
app.use(isValidDateAndRate);
app.use(isValidName);
app.use(isValidAge);

app.post('/talker', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  
  const talkers = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileName) => JSON.parse(fileName));

  const newTalker = { name, age, id: talkers.length + 1, talk: { watchedAt, rate } };

  talkers.push(newTalker);

  await fs.writeFile(TALKER_JSON, JSON.stringify(talkers));

  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const { id } = req.params;
  const updateTalker = { id: +id, name, age, talk: { watchedAt, rate } };

  const talkers = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileName) => JSON.parse(fileName));

  const getTalker = talkers.findIndex((talker) => talker.id === +id);
  
  talkers[getTalker] = { ...talkers[getTalker], ...updateTalker };

  await fs.writeFile(TALKER_JSON, JSON.stringify(talkers));

  return res.status(200).json(talkers[getTalker]);
});

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const talkers = await fs.readFile(TALKER_JSON, STANDARD_UNICODE)
    .then((fileName) => JSON.parse(fileName));

  talkers.filter((talker) => talker.id !== +id);

  return res.status(204).end();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
