const data = 'mongodb://localhost:27017/mestodb';
const PORT = '3000';
const HOST = 'http://localhost';

const db = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  connectTimeoutMS: 0,
};

const urlValidation = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: true,
  allow_trailing_dot: false,
};

const emailValidation = {
  require_tld: true,
};
const urlPattern = /^(https?:\/\/)((((www\.)?[\w\d](([\w\d.-]+)*)[\w\d]*\.(([a-z]{2,})\.?)+)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(:(?=[1-9])([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])?)?)(\/(?!\/)[\w\d]*)*?#?(\.\w{2,})?$/;

module.exports = {
  emailValidation, urlValidation, db, HOST, PORT, data, urlPattern,
};
