import { Response } from "express";
import { ClientRequest, IncomingMessage } from "http";
import { Options } from "http-proxy-middleware";
import ROUTE_PATHS from "../route-defines";

interface ProxyConfig{
    [context: string]: Options<IncomingMessage,Response>
}
const proxyConfig: ProxyConfig = {
    [ROUTE_PATHS.AUTH_SERVICE.path]: {
        target: ROUTE_PATHS.AUTH_SERVICE.target,
        pathRewrite: (path,_req) => {
            return `${ROUTE_PATHS.AUTH_SERVICE.path}${path}`
        },
        on: {
            proxyReq: (proxyReq: ClientRequest, _req: IncomingMessage,_res: Response)=>{
                
            }
        }
    }
}