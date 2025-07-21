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
            ok: true,
            data: {
                code: 200,
                message: "GET request received",
                details: `GET requests to this endpoint are allowed`,
                timestamp: new Date().toISOString()
            },
            error: null,
        });
        return;
    }

    // ! Note: This should not be reached when cross-origin
    // - The OPTIONS preflight check should block it
    // - Direct requests may avoid OPTIONS and reach it

    // Handle all other requests with not allowed error
    response.setHeader('Allow', allowedMethods);
    response.status(405).json({
        ok: false,
        data: null,
        error: {
            code: 405,
            message: "Method not allowed",
            details: `${request.method} functionality not allowed`,
            timestamp: new Date().toISOString()
        }
    });
    return;

}