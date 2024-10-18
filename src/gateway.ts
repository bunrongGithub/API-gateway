
import express,{Express} from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
// import type {Filter,Options,RequestHandler} from "http-proxy-middleware"
import router from "./routes/routes";
const app:Express = express();
const PORT = 4001;
app.use('/',router);


const proxyMiddleware = createProxyMiddleware({
    target:'http://www.example.org/api',
    changeOrigin: true
});
app.use('/api',proxyMiddleware)
app.listen(PORT, ()=> {
    console.log(`server running on port: `, PORT)
})