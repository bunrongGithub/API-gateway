import path from "path";
import dotenv from "dotenv";
import Joi from "joi";
type Configs = {
    port: number;
    env: string;
    authServiceURL: string;
    productServicURL: string
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
    }
}
const configs = loadConfig();
export default configs;