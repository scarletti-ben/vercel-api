// > ======================================================
// > Exported Handler for the `test` Endpoint
// > ======================================================

/**
 * API handler for the `test` endpoint
 * - Runs in a Node.js environment
 * - Request and Response will actually be Next.js types
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {void}
 */
export default function handler(request, response) {

    // Allowed methods used for CORS and "Allow" header
    const allowedMethods = 'GET, OPTIONS';

    // Set CORS headers to allow cross-origin requests
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', allowedMethods);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // ! Note: Cross-origin requests often send OPTIONS preflight
    // - Browser checks if method in allowedMethods
    // - Usually the main request is only sent if OPTIONS allows it

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
    
    // ! Note: This will not be reached when cross-origin
    // - The OPTIONS preflight check should block it

    // Handle all other requests with not implemented error
    response.setHeader('Allow', allowedMethods);
    response.status(501).json({
        message: `${request.method} request received - TEST STRING`,
        data: request.query,
        timestamp: new Date(),
        info: `${request.method} functionality not implemented`,
        ok: false
    });
    return;

}