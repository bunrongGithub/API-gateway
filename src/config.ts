import path from "path";
import dotenv from "dotenv";
import Joi from "joi";
type Configs = {
    port: number;
    env: string;
    authServiceURL: string;
    productServicURL: string;
    userServiceURL: string;
    clientURL: string;
    awsCognitoUserPoolId: string;
    awsCognitoClientId: string;
    awsCloudwatchLogsRegion:string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
}
const loadConfig = ():Configs => {
    const env = process.env.NODE_ENV || 'dev';
    const envPart = path.resolve(__dirname,`./configs/.env.${env}`);
    dotenv.config({path: envPart});
    const envVarsSchema = Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().default(6000),
        AUTH_SERVICE_URL: Joi.string().required(),
        PRODUCT_SERVICE_URL: Joi.string().required(),
        USER_SERVICE_URL: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
        AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
        AWS_COGNITO_CLIENT_ID: Joi.string().required(),
        AWS_CLOUDWATCH_LOGS_REGION: Joi.string().required(),
        AWS_CLOUDWATCH_LOGS_GROUP_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    }).unknown().required();
    const { value: envVars, error } = envVarsSchema.validate(process.env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return {
        env: envVars.NODE_ENV,
        port: envVars.PORT,
        authServiceURL: envVars.AUTH_SERVICE_URL,
        productServicURL: envVars.PRODUCT_SERVICE_URL,
        userServiceURL: envVars.USER_SERVICE_URL,
        clientURL: envVars.CLIENT_URL,
        awsCognitoUserPoolId: envVars.AWS_COGNITO_USER_POOL_ID,
        awsCognitoClientId: envVars.AWS_COGNITO_CLIENT_ID,
        awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
        awsCloudwatchLogsRegion: envVars.AWS_CLOUDWATCH_LOGS_REGION,
        awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    }
}
const configs = loadConfig();
export default configs;