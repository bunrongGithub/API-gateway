import express,{Express, Request, Response} from "express";
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware";
import {authenticateToken, authprizeRole, routeConfigMiddleware} from "./middlewares/auth";
import router from "./routes/routes";
import corsOptions from "./middlewares/cors";
import cookieParser from "cookie-parser";
const proxyMiddleware = createProxyMiddleware({
    target:'http://www.example.org/api',
    changeOrigin: true
});
// =========================
// Initialize App Express
// =========================
const app:Express = express();
// =========================
// Security Middleware
// =========================
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/v1/gateway-health',(_req:Request,res:Response)=>{res.status(200).json({message:"OK"})});

// ==========================
// Auth Middleware
// ==========================
app.use(routeConfigMiddleware);
app.use(authenticateToken);
app.use(authprizeRole)
app.use('/api',proxyMiddleware)
app.use('/',router);
app.use(cors({
    origin: '',
    credentials: true
}))



export default app;