// > ======================================================
// > Exported Handler for the `test` Endpoint
// > ======================================================

/**
 * API handler for the `test` endpoint
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @returns {void}
 */
export default function handler(request, response) {

    // Set CORS headers to allow cross-origin requests
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle an OPTIONS request (CORS preflight request)
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }

    // Handle a GET request
    if (request.method === 'GET') {
        response.status(200).json({
            message: 'GET request received',
            data: request.query,
            timestamp: new Date(),
            info: `GET requests to this endpoint are for testing`,
            ok: true
        });
        return;
    }

    // Handle all other requests with not implemented error
    response.setHeader('Allow', 'GET, OPTIONS');
    response.status(501).json({
        message: `${request.method} request received`,
        data: request.query,
        timestamp: new Date(),
        info: `${request.method} functionality not implemented`,
        ok: false
    });

}