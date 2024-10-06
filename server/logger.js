// server/logger.js

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Define el formato de los logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

// Configurar Winston
const logger = createLogger({
  level: 'info', // Se puede cambiar a 'debug' o 'error' según lo que quiera registrar
  format: combine(
    timestamp(),
    errors({ stack: true }),  // Incluir el stack trace en caso de errores
    logFormat
  ),
  transports: [
    // Guardar los logs en un archivo
    new transports.File({ filename: 'logs/server.log', level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Enviar los logs de nivel 'info' también a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;
