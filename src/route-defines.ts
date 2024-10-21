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
        target: configs?.authServiceURL,
        nestedRoutes: [
            {
                path: '/health',
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
        path:"/v1/product",
        target: configs.productServicURL,
        methods: {
            GET: {authRequired: false},
            POST: {authRequired: false}
        }
    }
}
export default ROUTE_PATHS;