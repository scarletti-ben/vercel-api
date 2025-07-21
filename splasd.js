/**
 * RSA-OAEP Decryption API Handler
 * 
 * Provides an endpoint for decrypting RSA-OAEP encrypted text using the Web Crypto API.
 * Supports CORS for cross-origin requests and handles encrypted text via query parameters.
 * 
 * @module test-rsa-oaep
 * @author Your Name
 * @version 1.0.0
 */

// ======================================================
// Constants
// ======================================================

/**
 * Allowed HTTP methods for CORS requests
 * @constant {string}
 */
const ALLOWED_METHODS = "GET, OPTIONS";

/**
 * Allowed request headers for CORS requests
 * @constant {string}
 */
const ALLOWED_HEADERS = "Content-Type";

// ======================================================
// Utility Functions
// ======================================================

/**
 * Convert an ArrayBuffer to a Base64-encoded string
 * 
 * @param {ArrayBuffer} buffer - The binary data to encode
 * @returns {string} The Base64-encoded string representation
 * @throws {TypeError} If buffer is not an ArrayBuffer
 */
function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert a Base64-encoded string to a Uint8Array
 * 
 * @param {string} base64 - The Base64-encoded string to decode
 * @returns {Uint8Array} The decoded binary data as a Uint8Array
 * @throws {DOMException} If base64 string is invalid
 */
function fromBase64(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// ======================================================
// Cryptographic Functions
// ======================================================

/**
 * Import a cryptographic key from Base64-encoded data
 * 
 * @async
 * @param {string} base64 - Base64-encoded key data (SPKI for public, PKCS#8 for private)
 * @param {"public"|"private"} type - The type of key to import
 * @returns {Promise<CryptoKey>} The imported cryptographic key
 * @throws {DOMException} If key import fails or key format is invalid
 */
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

/**
 * Decrypt RSA-OAEP encrypted data using a private key
 * 
 * @async
 * @param {string} encryptedBase64 - Base64-encoded encrypted data
 * @param {CryptoKey} privateKey - The RSA private key for decryption
 * @returns {Promise<string>} The decrypted plaintext as a UTF-8 string
 * @throws {DOMException} If decryption fails
 */
async function rsaDecrypt(encryptedBase64, privateKey) {
    const encryptedArray = fromBase64(encryptedBase64);

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedArray.buffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// ======================================================
// HTTP Handler Functions
// ======================================================

/**
 * Set up CORS headers for cross-origin resource sharing
 * 
 * @param {import('next').NextApiRequest} request - The incoming request object
 * @param {import('next').NextApiResponse} response - The response object
 */
function setupCORS(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
}

/**
 * Handle HTTP OPTIONS requests (CORS preflight)
 * 
 * @param {import('next').NextApiRequest} request - The incoming request object
 * @param {import('next').NextApiResponse} response - The response object
 * @returns {import('next').NextApiResponse} Response with 204 status
 */
function handleOptions(request, response) {
    return response.status(204).end();
}

/**
 * Handle unsupported HTTP methods
 * 
 * @param {import('next').NextApiRequest} request - The incoming request object
 * @param {import('next').NextApiResponse} response - The response object
 * @returns {import('next').NextApiResponse} Error response with 405 status
 */
function handleOther(request, response) {
    response.setHeader('Allow', ALLOWED_METHODS);
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

/**
 * Handle GET requests for RSA-OAEP decryption
 * 
 * Expects a 'text' query parameter containing Base64-encoded encrypted data.
 * Uses the private key from environment variables to decrypt the data.
 * 
 * @async
 * @param {import('next').NextApiRequest} request - The incoming request object
 * @param {import('next').NextApiResponse} response - The response object
 * @returns {Promise<import('next').NextApiResponse>} JSON response with decrypted text or error
 */
async function handleGet(request, response) {
    // Validate required query parameter
    if (!request.query.text) {
        return response.status(400).json({
            ok: false,
            status: 400,
            data: null,
            info: null,
            error: {
                code: 400,
                message: "Missing required parameter",
                details: "Missing 'text' parameter: ?text=<encrypted_data>",
            },
            timestamp: new Date().toISOString()
        });
    }

    try {
        
        // Decode and decrypt the provided text
        const encryptedBase64 = decodeURIComponent(request.query.text);
        const privateKey = await importKey(process.env.PRIVATE_KEY, "private");
        const decryptedText = await rsaDecrypt(encryptedBase64, privateKey);

        // Return successful response
        return response.status(200).json({
            ok: true,
            status: 200,
            data: {
                decryptedText
            },
            info: {
                code: 200,
                message: "Text successfully decrypted",
                details: "Decrypted text available in response.data.decryptedText",
            },
            error: null,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        // Handle any decryption or processing errors
        return response.status(500).json({
            ok: false,
            status: 500,
            data: null,
            info: null,
            error: {
                code: 500,
                name: error.name,
                message: error.message,
                details: 'Failed to decrypt the provided text'
            },
            timestamp: new Date().toISOString()
        });
    }
}

// ======================================================
// Main API Handler
// ======================================================

/**
 * Main API handler for the RSA-OAEP decryption endpoint
 * 
 * This endpoint accepts encrypted text via query parameters and returns the decrypted result.
 * It supports CORS for cross-origin requests and only allows GET and OPTIONS methods.
 * 
 * @example
 * // GET request with encrypted text
 * GET /api/test-rsa-oaep?text=<base64_encrypted_data>
 * 
 * @example
 * // Response format
 * {
 *   "ok": true,
 *   "status": 200,
 *   "data": {
 *     "decryptedText": "Hello, World!"
 *   },
 *   "info": {
 *     "code": 200,
 *     "message": "Text successfully decrypted",
 *     "details": "Decrypted text available in response.data.decryptedText"
 *   },
 *   "error": null,
 *   "timestamp": "2025-07-21T10:30:00.000Z"
 * }
 * 
 * @async
 * @param {import('next').NextApiRequest} request - Next.js API request object
 * @param {import('next').NextApiResponse} response - Next.js API response object
 * @returns {Promise<void>}
 * @throws {Error} Environment variable PRIVATE_KEY must be set with Base64-encoded private key
 */
export default async function handler(request, response) {
    // Set up CORS headers for all requests
    setupCORS(request, response);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return handleOptions(request, response);
    }

    // Handle GET requests (main functionality)
    if (request.method === 'GET') {
        return await handleGet(request, response);
    }

    // Handle all other unsupported methods
    return handleOther(request, response);
}