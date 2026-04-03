import pino from 'pino';

/**
 * Standardized logger utility for the application.
 * - In development: Pretty-printed logs for the terminal.
 * - In production: Structured JSON logs for better monitoring (Coolify/Axiom/Vercel).
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  browser: {
    asObject: true,
  },
  transport:
    typeof window === 'undefined' && process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export default logger;
