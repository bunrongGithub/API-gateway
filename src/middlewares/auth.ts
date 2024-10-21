import { CognitoJwtVerifier } from "aws-jwt-verify";
import configs from "../config";
import { NextFunction, Request, Response } from "express";
import ROUTE_PATHS, { RouteConfig } from "../route-defines";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
declare global {
    namespace Express {
        interface Request {
            currentUser: {
                username: string;
                role: string[] | undefined;
            }
            routeConfig: RouteConfig
            methodConfig: {
                authRequired: boolean;
                roles?: string[];
            }
        }
    }
}

const verifier = CognitoJwtVerifier.create({
    userPoolId: configs.awsCognitoUserPoolId,
    tokenUse: 'access',
    clientId: configs.awsCognitoClientId
});
// TODO: implement the authenticateToken function
// Step 1: Check if the method config requires authentication
// Step 2: If authentication is required, check if the user is authenticated
// Step 3: If authentication is required and the user is authenticated, attach the user to the request object
// Step 4: If authentication is not required, call next()
const authenticateToken = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { methodConfig } = req;
        if (methodConfig.authRequired) {
            const token = req.cookies?.['access_token'];
            if (!token) { throw new Error(`Please login to continue`) };

            const payload = await verifier.verify(token);
            if (!payload) { throw new Error; }

            let role: string[] = [];
            const userPayload = await jwtDecode(req.cookies?.['id_token']);
            console.log("userPayload", userPayload);
            // @ts-ignore
            if (userPayload['cognito:username'].includes('google')) {
                // @ts-ignore
                if (!userPayload['custom:role']) {
                    const { data } = await axios.get(`${configs.userServiceURL}/v1/users/me`, {
                        headers: {
                            'Cookie': `username=${userPayload.sub}`
                        }
                    });
                    console.log(data.data.role);
                    role.push(data.data.role);
                } else {
                    // @ts-ignore
                    role.push(userPayload['custom:role']);
                }
            } else {
                role = payload['cognito:groups'] || []
            }
            console.log('role', role);
            req.currentUser = {
                username: payload.username,
                role
            };
        }
        next();
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}
const findRouteConfig = (path: string, routeConfigs: RouteConfig): RouteConfig | null => {
    const trimmedPath = path.replace(/\/+$/, "");
    const requestSegments = trimmedPath.split("/").filter(Boolean);
    const routeSegments = routeConfigs.path.split("/").filter(Boolean);
    if (routeSegments.length > requestSegments.length) {
        return null;
    }
    for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const requestSegment = requestSegments[i];

        if (routeSegment.startsWith(":")) {
            // Dynamic segment, can be anything, so it matches
            continue;
        }

        if (routeSegment !== requestSegment) {
            return null; // Static segment mismatch
        }
    }

    // STEP 4: If no nested routes, return the current routeConfig
    if (!routeConfigs.nestedRoutes) {
        return routeConfigs;
    }

    // STEP 5: Find the remaining path after matching the base path
    const remainingPath = `/${requestSegments.slice(routeSegments.length).join("/")}`;

    // STEP 6: Check if any nested routes match the remaining path
    for (const nestedRouteConfig of routeConfigs.nestedRoutes) {
        const nestedResult = findRouteConfig(remainingPath, nestedRouteConfig);
        if (nestedResult) {
            return nestedResult;
        }
    }

    // If no nested route matches, return the current routeConfig
    return routeConfigs;

}

// TODO: implement the routeConfigMiddleware function
// Step 1: Find the route config for the requested path
// Step 2: Check if the route config has a method for the requested method
// Step 3: Attach the route configuration and method config to the request object
const routeConfigMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const { path, method } = req;
    // Step 1
    let routeConfig = null;
    for (const key in ROUTE_PATHS) {
        routeConfig = findRouteConfig(path, ROUTE_PATHS[key]);
        console.log('route config', routeConfig);
        if (routeConfig) break;
    }
    if (!routeConfig) {
        return next(new Error('Route not found'));
    }
    // Step 2
    const methodConfig = routeConfig.methods?.[method];
    if (!methodConfig) {
        return next(new Error('Method not allowed'));
    }
    // Attach the route configuration and method config to the request object
    req.routeConfig = routeConfig;
    req.methodConfig = methodConfig;

    console.log('req.routeConfig', routeConfig);
    console.log('req.methodConfig', methodConfig);

    next();
}
// TODO: implement the authorizeRole function
// Step 1: Check if the user is authenticated
// Step 2: Check if the user has the required role
// Step 3: If the user is authenticated and has the required role, call next()
// Step 4: If the user is not authenticated, return a 401 Unauthorized status
const authprizeRole = (req: Request,_res:Response,next: NextFunction) => {
    const {methodConfig,currentUser} = req;
// Check if the route requires specific roles
  if (methodConfig.roles) {
    // If the user is not authenticated or does not have any of the required roles, throw an error
    if (!currentUser || !Array.isArray(currentUser.role) || !currentUser.role.some(role => methodConfig.roles!.includes(role))) {
      return next(new Error("Authorize Error!"));
    }
  }
  next();
}
export { authenticateToken, routeConfigMiddleware ,authprizeRole}