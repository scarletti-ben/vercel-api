// < ======================================================
// < Internal Base64 Conversion Functions
// < ======================================================

/**
 * Convert an ArrayBuffer to a Base64-encoded string
 * 
 * @param {ArrayBuffer} buffer - The binary data to encode
 * @returns {string} The Base64 string
 */
function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function fromBase64(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
// < ======================================================
// < Internal Import Private Key Function
// < ======================================================

async function importKey(base64, type) {

    const binary = fromBase64(base64);

    return await crypto.subtle.importKey(
        type === "public" ? "spki" : "pkcs8",
        binary.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        [type === "public" ? "encrypt" : "decrypt"]
    );

}

// Decrypt RSA-OAEP encrypted data
async function rsaDecrypt(encryptedBase64, privateKey) {

    encryptedArray = fromBase64(encryptedBase64);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedArray.buffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// < ======================================================
// < Internal Magic Function
// < ======================================================

async function magic(encryptedData) {
    return await rsaDecrypt(encryptedData, privateKey);
}

// > ======================================================
// > Exported Handler for the `test-rsa-oaep` Endpoint
// > ======================================================

/**
 * API handler for the `test-rsa-oaep` endpoint
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

        let outputText = '';
        try {

            const privateKey = await importKey(process.env.PRIVATE_KEY, "private");
            outputText = await rsaDecrypt(request.query.text, privateKey);

        } catch (error) {
            return response.status(500).json({
                ok: false,
                status: 500,
                data: null,
                info: null,
                error: {
                    code: 500,
                    name: error.name,
                    message: error.message,
                    details: 'Unexpected error doing magic'
                },
                timestamp: new Date().toISOString()
            })
        }

        // ~ Handle a GET request with success response
        return response.status(200).json({
            ok: true,
            status: 200,
            data: {
                text: outputText
            },
            info: {
                code: 200,
                message: "Text successfully decrypted",
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