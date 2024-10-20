import express,{Express} from "express";
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware";
import router from "./routes/routes";
const proxyMiddleware = createProxyMiddleware({
    target:'http://www.example.org/api',
    changeOrigin: true
});
const app:Express = express();
app.use('/api',proxyMiddleware)
app.use('/',router);
app.use(cors({
    origin: '',
    credentials: true
}))



export default app;