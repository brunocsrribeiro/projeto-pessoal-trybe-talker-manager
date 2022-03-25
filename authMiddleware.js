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

module.exports = {
  generatedToken,
  validatedEmail,
  validatedPassword,
};
