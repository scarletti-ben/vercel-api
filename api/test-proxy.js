// < ======================================================
// < Internal Proxy Fetch Function
// < ======================================================

/**
 * Make a safe fetch request to an external URL
 * - Returns an object for use as API response
 * @async 
 * @param {string} url - The target URL to fetch from
 * @returns {Promise<object>}
 */
async function proxyFetch(url) {

    try {

        const response = await fetch(url);
        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                data: null,
                info: null,
                error: {
                    code: response.status,
                    message: response.statusText,
                    details: ''
                },
                timestamp: new Date().toISOString()
            };
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return {
                ok: true,
                status: response.status,
                data: await response.json(),
                info: {
                    code: response.status,
                    message: response.statusText,
                    details: `Content type: ${contentType}`
                },
                error: null,
                timestamp: new Date().toISOString()
            }
        } else {
            return {
                ok: true,
                status: response.status,
                data: {
                    text: await response.text()
                },
                info: {
                    code: response.status,
                    message: response.statusText,
                    details: `Content type: ${contentType}`
                },
                error: null,
                timestamp: new Date().toISOString()
            }
        }

    } catch (error) {
        return {
            ok: false,
            status: 500,
            data: null,
            info: null,
            error: {
                code: 500,
                name: error.name,
                message: error.message,
                details: 'Unexpected error in proxyFetch'
            },
            timestamp: new Date().toISOString()
        }
    }

}

// > ======================================================
// > Exported Handler for the `test-proxy` Endpoint
// > ======================================================

/**
 * API handler for the `test-parameters` endpoint
 * - Runs in a Node.js environment
 * - Request and Response will actually be Next.js types
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {void}
 */
export default async function handler(request, response) {

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
        return response.status(204).end();
    }

    // Handle a GET request
    if (request.method === 'GET') {

        // Make a proxyFetch request if `url` parameter found
        if (request.query.url) {
            const fetchResponse = await proxyFetch(request.query.url);
            const fetchStatus = fetchResponse.status;
            return response.status(fetchStatus).json(fetchResponse);
        }

        // Error response if 'url' parameter missing
        return response.status(400).json({
            ok: false,
            status: 400,
            data: null,
            info: null,
            error: {
                code: 400,
                message: "Missing required parameter",
                details: "Missing 'url' parameter: ?url=https://www.example.com",
            },
            timestamp: new Date().toISOString()
        });

    }

    // ! Note: This should not be reached when cross-origin
    // - The OPTIONS preflight check should block it
    // - Direct requests may avoid OPTIONS and reach it

    // Handle all other requests with not allowed error
    response.setHeader('Allow', allowedMethods);
    return response.status(405).json({
        ok: false,
        status: 405,
        data: null,
        info: null,
        error: {
            code: 405,
            message: "Method not allowed",
            details: `${request.method} method not allowed`,
        },
        timestamp: new Date().toISOString()
    });

}