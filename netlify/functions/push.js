const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    // Add CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    // Handle preflight requests
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { access_token, ...pushData } = body;
        if (!access_token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing access_token" }),
            };
        }

        const response = await fetch("https://api.pushbullet.com/v2/pushes", {
            method: "POST",
            headers: {
                "Access-Token": access_token,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(pushData),
        });

        // Check if response is ok and try to parse JSON
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            try {
                data = await response.json();
            } catch (parseError) {
                data = { error: "Failed to parse response as JSON" };
            }
        } else {
            // If not JSON, get text response
            const textResponse = await response.text();
            data = {
                error: "Unexpected response format",
                status: response.status,
                response: textResponse,
            };
        }

        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
