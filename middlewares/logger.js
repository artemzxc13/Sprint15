const winston = require('winston');
const expressWinston = require('express-winston');
const moment = require('moment-timezone');
const path = require('path');

const loggerFormat = winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${JSON.stringify(info.meta)}`);
const convertTimeZone = winston.format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
  return info;
});
const requestsLogger = expressWinston.logger({
  transports: [new winston.transports.File({
    filename: path.join(__dirname, '..', 'logs', 'requests.log'),
    level: 'info',
    maxsize: 100000,
    maxFiles: 3,
    tailable: true,
  })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
});

const errorsLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({
    filename: path.join(__dirname, '..', 'logs', 'errors.log'),
    level: 'error',
    maxsize: 100000,
    maxFiles: 3,
    tailable: true,
  })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
});

module.exports = { requestsLogger, errorsLogger };
