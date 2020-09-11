require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const colors = require('colors');
const mongoose = require('mongoose');
const { celebrate, errors, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const {
  db, HOST, PORT, data, urlPattern,
} = require('./datadb/base');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(data, db)
  .then(() => console.log('Соединение с БД установлено:', colors.yellow(data)))
  .catch((err) => console.log('Ошибка соединения с БД:', err.message));
app.use(requestsLogger);

// -- Краш-тест --
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// -- Краш-тест --

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[a-zA-Zа-яА-ЯёЁ -]*$/),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern).required(),
    email: Joi.string().required().email(),
    password: Joi.string().alphanum()
      .min(8)
      .max(16)
      .required(),
  }),
}), createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorsLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден.'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message: errMessage } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : errMessage,
  });
});

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${(colors.blue(HOST))}:${colors.green(PORT)}`);
});
