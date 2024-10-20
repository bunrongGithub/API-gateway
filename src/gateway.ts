
import app from "./app";
import configs from "./config";
app.listen(configs.port, ()=> {
    console.log(`api gateway running on port: `, configs.port)
})