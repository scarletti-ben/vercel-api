// < ======================================================
// < Internal Import Private Key Function
// < ======================================================

async function importPrivateKey(pem) {
    const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["decrypt"]
    );
}

// > ======================================================
// > Exported Handler for the `test-key` Endpoint
// > ======================================================

/**
 * API handler for the `test-key` endpoint
 * - Runs in a Node.js environment
 * - Request and Response types from Next.js
 * 
 * @async
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {void}
 */
export default async function handler(request, response) {

    // ~ Allowed methods used for CORS and "Allow" header
    const allowedMethods = 'GET, OPTIONS';

    // ~ Set CORS headers to allow cross-origin requests
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', allowedMethods);
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    /**
     * > Note 
     * - Cross-origin requests often send OPTIONS preflight
     * - Browser checks if method in allowedMethods
     * - Usually the main request is only sent if OPTIONS allows it
     */

    // ~ Handle an OPTIONS request (CORS preflight request)
    if (request.method === 'OPTIONS') {
        return response.status(204).end();
    }

    // ~ Handle a GET request
    if (request.method === 'GET') {

        if (!request.query.text) {
            // ~ Error response if 'text' parameter missing
            return response.status(400).json({
                ok: false,
                status: 400,
                data: null,
                info: null,
                error: {
                    code: 400,
                    message: "Missing required parameter",
                    details: "Missing 'text' parameter: ?text=words",
                },
                timestamp: new Date().toISOString()
            });
        }

        // ~ Do magic
        const privateKey = await importPrivateKey(process.env.PRIVATE_KEY);
        const ciphertext = Uint8Array.from(atob(text), c => c.charCodeAt(0));
        const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, ciphertext);
        const decoded = new TextDecoder().decode(decrypted);
        
        // ~ Handle a GET request with success response
        return response.status(200).json({
            ok: true,
            status: 200,
            data: {
                text: decoded
            },
            info: {
                code: 200,
                message: "Text successfully decoded",
                details: `response.data.text accessible`,
            },
            error: null,
            timestamp: new Date().toISOString()
        });

    }

    /**
     * > Note 
     * - This should not be reached when cross-origin
     * - The OPTIONS preflight check should block it
     * - Direct requests may avoid OPTIONS and reach it
     */

    // ~ Handle all other requests with error response
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