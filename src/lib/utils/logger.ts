type ConsoleMethod = (...args: unknown[]) => void;

const isDev = import.meta.env.DEV;

const createLogger =
  (method: ConsoleMethod): ConsoleMethod =>
  (...args) => {
    if (!isDev) {
      return;
    }

    method(...args);
  };

export const logger = {
  info: createLogger(console.info.bind(console)),
  warn: createLogger(console.warn.bind(console)),
  error: createLogger(console.error.bind(console))
};
