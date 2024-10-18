const express = require("express");
const axios = require("axios");
const router = express.Router();
const registry = require("./registry.json");

router.all('/:apiName/:path*', async (req, res) => {
    const apiName = req.params.apiName;
    const path = req.params.path + (req.params[0] ? req.params[0] : ''); // Handle additional paths
    console.log(path);
    
    // Check if the service exists in the registry
    if (!registry.services[apiName]) {
        return res.status(404).json({ error: `Service ${apiName} not found in registry` });
    }

    const serviceUrl = registry.services[apiName].url + path;
    
    try {
        // Forward the request method, headers, and body
        const response = await axios({
            method: req.method,
            url: serviceUrl,
            data: req.body,
            headers: req.headers,
        });
        
        // Send the response from the service back to the client
        res.status(response.status).send(response.data);
    } catch (error) {
        // Handle errors and return the appropriate status and message
        console.error(error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

module.exports = router;
