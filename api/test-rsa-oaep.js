/**
 * @fileoverview RSA-OAEP Decryption API Handler
 * - Decryption uses the Web Crypto API
 * - Supports CORS and query parameters
 * @author Ben Scarletti
 * @since 2025-07-21
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < ======================================================
// < Constants
// < ======================================================

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

// < ======================================================
// < Utility Functions
// < ======================================================

/**
 * Convert a Base64-encoded string to a Uint8Array
 * 
 * @param {string} base64 - The Base64-encoded string to decode
 * @returns {Uint8Array} The decoded binary data as a Uint8Array
 * @throws {DOMException} If Base64 string is invalid
 */
function fromBase64(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

/**
 * Convert ArrayBuffer string to Base64
 * 
 * @param {ArrayBuffer} buffer - The ArrayBuffer to encode
 * @returns {string} The Base64-encoded string
 * @throws {DOMException} If any invalid characters found
 */
function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// < ======================================================
// < Cryptographic Functions
// < ======================================================

/**
 * Import a cryptographic key from Base64-encoded data
 * 
 * @async
 * @param {string} base64 - Base64-encoded key data
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
 * Encrypt text usingpublic key
 * 
 * @async
 * @param {string} text - Plain text to encrypt
 * @param {CryptoKey} publicKey - The public key for encryption
 * @returns {Promise<string>} Base64-encoded encrypted data
 */
async function rsaEncrypt(text, publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        data
    );
    return toBase64(encryptedBuffer);
}

/**
 * Decrypt encrypted data using private key
 * 
 * @async
 * @param {string} encryptedBase64 - Base64-encoded encrypted data
 * @param {CryptoKey} privateKey - The private key for decryption
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

// < ======================================================
// < Function for CORS Setup
// < ======================================================

/**
 * Set up CORS headers for cross-origin resource sharing
 * 
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {void}
 */
function setupCORS(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
    response.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
}

// < ======================================================
// < Handler for OPTIONS Request
// < ======================================================

/**
 * Handle HTTP OPTIONS requests (CORS preflight)
 * 
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {Response} response - Response with 204 status
 */
function handleOptions(request, response) {
    return response.status(204).end();
}

// < ======================================================
// < Handler for GET Request
// < ======================================================

/**
 * Handle GET requests for RSA-OAEP decryption
 * 
 * Expects a 'text' query parameter containing Base64-encoded encrypted data.
 * Uses the private key from environment variables to decrypt the data.
 * 
 * @async
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {Promise<Response>} response - Response with text or error
 */
async function handleGet(request, response) {

    // ~ Validate the required query parameters
    if (!request.query.plain && !request.query.encoded) {
        return response.status(400).json({
            ok: false,
            status: 400,
            data: null,
            info: null,
            error: {
                code: 400,
                message: "Missing required parameter",
                details: "Missing 'plain' or 'encrypted' parameter",
            },
            timestamp: new Date().toISOString()
        });
    }

    try {

        // ~ Handle encrypting plain text
        if (request.query.plain) {

            // ~ Encrypt the provided text
            const publicKey = await importKey(process.env.PUBLIC_KEY, "public");
            const encryptedBase64 = await rsaEncrypt(TEXT, publicKey);
            const encodedBase64 = encodeURIComponent(encryptedBase64);

            // ~ Return successful response
            return response.status(200).json({
                ok: true,
                status: 200,
                data: {
                    text: encodedBase64
                },
                info: {
                    code: 200,
                    message: "Text successfully encrypted",
                    details: "Encrypted text available at response.data.text",
                },
                error: null,
                timestamp: new Date().toISOString()
            });

        }

        // ~ Decrypt the provided text
        const encodedBase64 = request.query.text;
        const encryptedBase64 = decodeURIComponent(encodedBase64);
        const privateKey = await importKey(process.env.PRIVATE_KEY, "private");
        const decryptedBase64 = await rsaDecrypt(encryptedBase64, privateKey);

        // ~ Return successful response
        return response.status(200).json({
            ok: true,
            status: 200,
            data: {
                text: decryptedBase64
            },
            info: {
                code: 200,
                message: "Text successfully decrypted",
                details: "Decrypted text available at response.data.text",
            },
            error: null,
            timestamp: new Date().toISOString()
        });

    } catch (error) {

        // ~ Return unsuccessful response
        return response.status(500).json({
            ok: false,
            status: 500,
            data: null,
            info: null,
            error: {
                code: 500,
                name: error.name,
                message: error.message,
                details: 'Failed to process the provided text'
            },
            timestamp: new Date().toISOString()
        });

    }

}

// < ======================================================
// < Handler for Unsupported Request
// < ======================================================

/**
 * Handle unsupported HTTP methods
 * 
 * @param {Request} request - Next.js request object
 * @param {Response} response - Next.js response object
 * @returns {Response} response - Error response with 405 status
 */
function handleUnsupported(request, response) {
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

    /**
     * Set CORS headers to control cross-origin requests
     * - Sets `Access-Control-Allow-Origin`
     * - Sets `Access-Control-Allow-Methods`
     * - Sets `Access-Control-Allow-Headers`
     */
    setupCORS(request, response);

    /**
     * Handle an `OPTIONS` request (CORS preflight request)
     * - Cross-origin requests often send `OPTIONS` preflight
     * - Browser checks `Access-Control-Allow-Methods` header
     * - Usually a request is not sent if method not allowed
     */
    if (request.method === 'OPTIONS') {
        return handleOptions(request, response);
    }

    /**
     * Handle a `GET` request
     * - The core functionality of this endpoint
     * 
     * @async
     */
    if (request.method === 'GET') {
        return await handleGet(request, response);
    }

    /**
     * Handle all other requests
     * - This should not be reached when cross-origin
     * - The OPTIONS preflight check should block it
     * - Direct requests may avoid OPTIONS and reach it
     */
    return handleUnsupported(request, response);

}