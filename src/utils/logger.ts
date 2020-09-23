import signale from 'signale';

export type LogLevel = undefined | 'verbose' | 'veryVerbose' | 'quiet';

export interface Logger {
  /** The level at which to log messages */
  logLevel?: LogLevel;
  /** The default logger. Always on */
  log: signale.Signale<signale.DefaultMethods>;
  /** The verbose log. Has more debug logs */
  verbose: signale.Signale<signale.DefaultMethods>;
  /** The very verbose log. Has all debug logs */
  veryVerbose: signale.Signale<signale.DefaultMethods>;
}

/** Create a dummy logger for testing. */
export function createDummyLog(): Logger {
  return {
    log: new signale.Signale({ disabled: true }),
    verbose: new signale.Signale({ disabled: true }),
    veryVerbose: new signale.Signale({ disabled: true }),
  };
}

const logger: Logger = {
  log: new signale.Signale(),
  verbose: new signale.Signale(),
  veryVerbose: new signale.Signale(),
};

/** Turn the logs on an off */
function toggleLogs(
  options: Record<Exclude<keyof Logger, 'logLevel'>, boolean>
) {
  Object.entries(options).forEach(([level, enabled]) => {
    if (enabled) {
      // @ts-ignore
      logger[level].enable();
    } else {
      // @ts-ignore
      logger[level].disable();
    }
  });
}

/** Set the log level */
export function setLogLevel(newLogLevel: LogLevel) {
  logger.logLevel = newLogLevel;

  if (logger.logLevel === 'verbose') {
    toggleLogs({ log: true, verbose: true, veryVerbose: false });
  } else if (logger.logLevel === 'veryVerbose') {
    toggleLogs({ log: true, verbose: true, veryVerbose: true });
  } else if (logger.logLevel === 'quiet') {
    toggleLogs({ log: false, verbose: false, veryVerbose: false });
  } else {
    toggleLogs({ log: true, verbose: false, veryVerbose: false });
  }
}

/** Create a logger the the given log level. */
export function createLogger(): Logger {
  return logger;
}
