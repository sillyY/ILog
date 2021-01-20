import * as chalk from 'chalk'
import * as dayjs from 'dayjs'

export const LOGGER_LEVEL = 4

export enum Levels {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  SUCCESS = 3,
  ERROR = 4,
}

export const Colors = {
  debug: chalk.white,
  log: chalk.white,
  info: chalk.blueBright,
  success: chalk.greenBright,
  warn: chalk.bgYellow.black,
  error: chalk.bgRed.black,
}

export const Separators = {
  debug: '›',
  info: 'ℹ',
  log: '',
  success: '✅',
}

type Method = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error'

function prunePrefix(method: Method) {
  if (method === 'warn') {
    return Colors.warn(` ${method.toUpperCase()} `)
  }
  if (method === 'error') {
    return Colors.error(` ${method.toUpperCase()} `)
  }

  const separator = Separators[method]

  return separator
    ? `[${Colors[method](`${separator} ${method.toUpperCase()}`)}]`
    : `[${Colors[method](method.toUpperCase())}]`
}

class Logger {
  public static getInstance = (): Logger =>
    (Logger.instance = Logger.instance
      ? Logger.instance
      : new Logger(LOGGER_LEVEL))

  private static instance?: Logger
  private level: Levels
  private tag: string = ''

  private constructor(level: Levels) {
    this.level = level
  }

  public setLevel(level: Levels): void {
    this.level = level
  }

  public setTag(tag: string): void {
    this.tag = tag
  }

  public debug(...args: string[]): void {
    if (this.level === Levels.DEBUG) {
      this.log('debug', ...args)
    }
  }

  public error(...args: string[]): void {
    if (this.level <= Levels.ERROR) {
      this.log('error', ...args)
    }
  }

  public info(...args: string[]): void {
    if (this.level <= Levels.INFO) {
      this.log('info', ...args)
    }
  }

  public success(...args: string[]): void {
    if (this.level <= Levels.SUCCESS) {
      this.log('success', ...args)
    }
  }

  public warn(...args: string[]): void {
    if (this.level <= Levels.WARN) {
      this.log('warn', ...args)
    }
  }

  private log(method: Method, ...args: string[]): void {
    const tag = chalk.bgRgb(160, 80,246).white(`${this.tag ? `[${this.tag}]` : ''}`)
    const prefix = prunePrefix(method)
    const date = ` <${dayjs().format('YYYY-MM-DD HH:mm:ss')}> `
    const message = [...args].join(' > ')
    console.log(`${tag} ${prefix} ${date} ${message}\n`)
  }
}

export const logger = Logger.getInstance()
