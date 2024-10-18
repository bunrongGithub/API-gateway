interface Service {
  api: string;
  host: string;
  port: number;
  url: string;
}
interface ServicesRegistry {
  services: {
    [key: string]: Service;
  };
}
const registry: ServicesRegistry = {
  services:{
    // define service name
    server:{
      api:'server',
      host:'http://localhost',
      port: 3001,
      url:"http://localhost:3001/"
    },
    auth:{
      api:'auth',
      host:'http://localhost',
      port: 3002,
      url:"http://localhost:3002/"
    },
    express:{
      api:'express',
      host:'http://localhost',
      port: 4000,
      url:"http://localhost:4000/"
    }
  }
}
export default registry; 