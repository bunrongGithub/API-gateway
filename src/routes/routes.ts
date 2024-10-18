import express, { Request, Response } from "express";
import axios, { AxiosRequestHeaders } from "axios";
import registry from "./registry";

const router = express.Router();

router.all("/:service/:path*", async (request: Request, response: Response):Promise<any> => {
    const serviceName: string = request.params.service;
    const path: string = request.params.path + (request.params[0] ? request.params[0] : '');

    // Check if the service exists in the registry
    if (!registry.services[serviceName]) {
        return response.status(404).send({ error: `Service ${serviceName} not found` });
    }
    console.log(`path: ${path}`)
    // Build the full URL to the target service
    const serviceUrl: string = registry.services[serviceName].url + path;
    console.log(`service url: ${serviceUrl}`)
    try {
        // Forward the request to the target service using Axios
        const serviceResponse = await axios({
            method: request.method as any, // Type assertion as axios supports all HTTP methods
            url: serviceUrl,
            headers: request.headers as AxiosRequestHeaders, // Type assertion for Axios headers
            data: request.body // Forward the body (for POST, PUT, etc.)
        });

        // Send the response back to the client
        response.status(serviceResponse.status).send(serviceResponse.data);
    } catch (error: any) {
        // Handle any errors that occur during the request
        if (error.response) {
            // The request was made, but the server responded with a status code
            response.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            // The request was made, but no response was received
            response.status(500).send({ error: "No response received from service" });
        } else {
            // Something happened in setting up the request that triggered an error
            response.status(500).send({ error: "Error in setting up request" });
        }
    }
});

export default router;
