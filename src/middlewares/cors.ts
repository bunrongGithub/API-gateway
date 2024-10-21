import configs from "../config";
const corsOptions = {
    origin: configs.clientURL,
    credential: true, // Request includes credentials like cookies
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
}
console.log("corsOptions:::", corsOptions);
export default corsOptions