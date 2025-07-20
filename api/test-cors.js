// > ======================================================
// > Exported Handler for the `test-cors` Endpoint
// > ======================================================

/**
 * API handler for the `test-cors` endpoint
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @returns {void}
 */
export default function handler(request, response) {

    // Set CORS headers for all responses
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'GET') {
        response.status(200).json({
            message: 'GET request received',
            data: request.query,
            timestamp: new Date(),
            info: `GET requests to this endpoint are ceremonial`,
            ok: true
        });
    } else if (request.method === 'POST') {
        response.status(200).json({
            message: `POST request received`,
            data: request.body,
            timestamp: new Date(),
            info: `POST requests to this endpoint are ceremonial`,
            ok: true
        });
    } else if (request.method === 'OPTIONS') {
        response.status(200).json({
            message: 'OPTIONS request received',
            data: {},
            timestamp: new Date(),
            info: 'OPTIONS requests to this endpoint are ceremonial',
            ok: true
        });
    } else {
        response.status(405).json({
            message: `${request.method} request received`,
            data: request.query,
            timestamp: new Date(),
            info: `${request.method} requests are not allowed`,
            ok: false
        });
    }
    
}