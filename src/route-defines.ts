import configs from "./config";

export interface RouteConfig {
    path: string;
    target?: string;
    methods?: { 
        [method: string]:{
            authRequired: boolean;
            roles?: string[];
        };
    };
    nestedRoutes?: RouteConfig[];
}
export interface RoutesConfig{
    [route: string]: RouteConfig;
}
const ROUTE_PATHS: RoutesConfig = {
    AUTH_SERVICE: {
        path: "/v1/auth",
        target: configs?.productServicURL,
        nestedRoutes: [
            {
                path: '/google/login',
                methods: {
                    GET: {
                        authRequired: false
                    }
                }
            },
            {
                path:"/signup",
                methods:{
                    POST: {
                        authRequired: false,
                    }
                }
            }
        ]
    },
    PRODUCT_SERVICE:{
        path:"/v1/items",
        target: configs.productServicURL,
        methods: {
            GET: {authRequired: false},
            POST: {authRequired: false}
        }
    },
    USER_SERVICE: {
        path:'/v1/users',
        target: configs.userServiceURL,
        methods:{
            GET: {
                authRequired: true, roles:["user","admin"]
            },
            POST: {
                authRequired: true, roles: ["user","admin"]
            }
        },
        nestedRoutes:[
            {
                path:"/health",
                methods:{
                    GET: {
                        authRequired: false,
                    }
                }
            },
            {
                path: "/me",
                methods:{
                    GET: {
                        authRequired: true,roles: ["user","admin"]
                    }
                }
            }
        ]
    }
}
export default ROUTE_PATHS;
