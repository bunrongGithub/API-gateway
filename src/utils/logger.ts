import configs from '../config';
import { Request, Response } from 'express';
import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';


const createLogger = ({ awsRegion = configs.awsCloudwatchLogsRegion, logGroupName, service, level }: { awsRegion?: string, logGroupName: string, service: string, level: string }) => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    cloudwatch: {
      level,
      logGroupName,
      logStreamName: `${service}-${new Date().toISOString().split('T')[0]}`,
      awsRegion,
      awsAccessKeyId: configs.awsAccessKeyId,
      awsSecretKey: configs.awsSecretAccessKey,
    }
  };

  const cloudWatchTransport = new WinstonCloudwatch(options.cloudwatch);

  const logger = winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(options.console),
      cloudWatchTransport
    ]
  });

  return logger;
};

export const logRequest = (logger: winston.Logger, req: Request, additionalInfo: object = {}) => {
  logger.info(`Incomming Request ${{
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ...additionalInfo,
  }}`)
}

export const logResponse = (logger: winston.Logger, res: Response, additionalInfo: object = {}) => {
  logger.info('Outgoing Response', {
    statusCode: res.statusCode,
    headers: res.getHeaders(),
    ...additionalInfo
  });
};

export const logError = (logger: winston.Logger, error: Error, additionalInfo: object = {}) => {
  logger.error('Error', {
    message: error.message,
    stack: error.stack,
    ...additionalInfo
  });
};

export default createLogger;