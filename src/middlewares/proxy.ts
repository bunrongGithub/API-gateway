import express,{ Response } from "express";
import { ClientRequest, IncomingMessage } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import ROUTE_PATHS from "../route-defines";
import createLogger, { logRequest } from "../utils/logger";
import corsOptions from "./cors";
interface ProxyConfig {
    [context: string]: Options<IncomingMessage,Response>
}
const gatewayLogger = createLogger({level: "xxx",logGroupName:"xxxx",service: "auth"})
const proxyConfigs: ProxyConfig = {
    [ROUTE_PATHS.AUTH_SERVICE.path]: {
        target: ROUTE_PATHS.AUTH_SERVICE.target,
        pathRewrite: (path, _req) => {
            return `${ROUTE_PATHS.AUTH_SERVICE.path}${path}`
        },
        on: {
            proxyReq: (proxyReq: ClientRequest, _req: IncomingMessage, _res: Response) => {
                // @ts-ignore
                logRequest(gatewayLogger, proxyReq, {
                    protocol: proxyReq.protocol,
                    host: proxyReq.getHeader('host'),
                    path: proxyReq.path,
                    method: proxyReq.method
                });
            },
            proxyRes: (_proxyRes, _req, res) => {
                res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                );
            }
        }
    },
    [ROUTE_PATHS.USER_SERVICE.path]: {
        target: ROUTE_PATHS.USER_SERVICE.target,
        pathRewrite: (path, _req) => `${ROUTE_PATHS.USER_SERVICE.path}${path}`,
        on: {
            proxyReq: (proxyReq: ClientRequest, _req: IncomingMessage, _res: Response) => {
                // @ts-ignore
                logRequest(gatewayLogger, proxyReq, {
                    protocol: proxyReq.protocol,
                    host: proxyReq.getHeader('host'),
                    path: proxyReq.path
                });
            },
            proxyRes: (_proxyRes, _req, res) => {
                res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                );
            }
        }
    },
    [ROUTE_PATHS.PRODUCT_SERVICE.path]:{
        target: ROUTE_PATHS.PRODUCT_SERVICE.target,
        pathRewrite: (path,_res) => `${ROUTE_PATHS.PRODUCT_SERVICE.path}${path}`,
        on: {
            proxyReq: (proxyReq:ClientRequest,_req:IncomingMessage,_res:Response) => {
                //@ts-ignore
                logRequest(gatewayLogger,proxyReq,{
                    protocol: proxyReq.protocol,
                    host: proxyReq.getHeader("host"),
                    path: proxyReq.path,
                })
            },
            proxyRes: (_proxyRes,_req,res) => {
                res.setHeader("Access-Control-Allow-Origin",corsOptions.origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
                res.setHeader(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                );
            }
        }
    }
}
const applyProxy = (app: express.Application) => {
    Object.keys(proxyConfigs).forEach((context: string) => {
        app.use(context,createProxyMiddleware(proxyConfigs[context]));
    })
}
export default applyProxy;
