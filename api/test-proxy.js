// > ======================================================
// > Exported Handler for the `test-proxy` Endpoint
// > ======================================================

/**
 * API handler for the `test-proxy` endpoint
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @returns {void}
 */
export default async function handler(request, response) {

    // Set CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight (OPTIONS request)
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }

    // Handle GET request
    else if (request.method === 'GET') {
        try {
            const targetURL = request.query.url;
            if (!targetURL) {
                response.status(400).json({
                    error: 'Missing url parameter in fetch URL',
                    details: 'eg. fetch(api/test-proxy?url=www.example.com)'
                });
                return;
            }
            const targetResponse = await fetch(targetURL, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const targetStatus = targetResponse.status;
            const contentType = targetResponse.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await targetResponse.json();
                response.status(200).json({
                    message: `GET request proxied (JSON)`,
                    proxyStatus: targetStatus,
                    data,
                    ok: true
                });
            } else {
                const text = await targetResponse.text();
                response.status(200).json({
                    message: `GET request proxied (text)`,
                    proxyStatus: targetStatus,
                    data: { text },
                    ok: true
                });
            }
            return;
        } catch (error) {
            response.status(500).json({
                error: 'Fetch failed',
                details: error.message,
                ok: false
            });
        }
    }

    // Handle other requests
    else {
        response.status(405).json({
            error: 'Request method not allowed',
            details: `${request.method} not allowed`,
            ok: false
        });
        return;
    }

}