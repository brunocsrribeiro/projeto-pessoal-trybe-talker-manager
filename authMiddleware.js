const crypto = require('crypto');

function generatedToken() {
  return crypto.randomBytes(8).toString('hex');
}

function validatedEmail(email) {
  const VALIDATED_EMAIL = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const validEmail = VALIDATED_EMAIL.test(email);

  if (!email) {
    return 'O campo "email" é obrigatório';
  }

  if (validEmail === false) {
    return 'O "email" deve ter o formato "email@email.com"';
  }  
}

function validatedPassword(password) {
  const MIN_CHAR = 6;
  
  if (!password) {
    return 'O campo "password" é obrigatório';
  }
  
  const validPassword = password.length >= MIN_CHAR;
  
  if (validPassword === false) {
    return 'O "password" deve ter pelo menos 6 caracteres';
  } 
}

function isValidToken(req, res, next) {
  const { authorization } = req.headers;
  const MIN_LENGTH = 16;

  if (!authorization) {
   return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== MIN_LENGTH) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
}

function isValidName(req, res, next) {
  const { name } = req.body;
  const NAME_LENGTH = 3;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  const validName = name.length >= NAME_LENGTH;

  if (validName === false) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function isValidAge(req, res, next) {
  const { age } = req.body;
  const MIN_AGE = 18;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age < MIN_AGE) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
}

function isValidTalk(req, res, next) {
  const { talk } = req.body;

  if (!talk || talk.watchedAt === undefined || talk.rate === undefined) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }

  next();
}

function isValidDateAndRate(req, res, next) {
  const { talk: { watchedAt, rate } } = req.body;
  const dateRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const VALIDATED_DATE = dateRegex.test(watchedAt);

  if (!VALIDATED_DATE) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
}

module.exports = {
  generatedToken,
  validatedEmail,
  validatedPassword,
  isValidToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidDateAndRate,
};
