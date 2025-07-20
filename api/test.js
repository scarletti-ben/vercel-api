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
    } else {
        response.setHeader('Allow', ['GET', 'POST']);
        response.status(405).json({
            message: `${request.method} request received`,
            data: request.query,
            timestamp: new Date(),
            info: `${request.method} requests are not allowed`,
            ok: false
        });
    }
}