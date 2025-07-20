// > ======================================================
// > Exported Handler for the Test Endpoint
// > ======================================================

/**
 * API handler for the test endpoint
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @returns {void}
 */
export default function handler(request, response) {
    if (request.method === 'GET') {
        response.status(200).json({
            message: 'Hello from API!',
            timestamp: new Date()
        });
    } else if (request.method === 'POST') {
        const { name } = request.body;
        response.status(200).json({
            message: `Hello ${name}!`
        });
    } else {
        response.setHeader('Allow', ['GET', 'POST']);
        response.status(405).end(`Method ${request.method} Not Allowed`);
    }
}