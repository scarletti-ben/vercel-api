/**
 * RSA-OAEP Encryption Client
 * Encrypts text using public key for use with your decryption API
 */

const PUBLIC_KEY_BASE64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxLp2mik3V6aiRSMuaWOemvV1k3goDhmNRnwQhcrulOHQTBG9JYetfHKrtZZYEvVzV1a5fU/hM9gT9QlYX2epHZXyiJhAzG+8fQBNl/Gx206MwOo/c+z0OVzYMqL4rVDUYwLeD8TZJ13h52G0lPGw+rjck1L+okcglmXelMAmbgnuwQdBThWggK9CYRrusQ7pUKf3F7aRd1ZTsSvDcyv8uTKf4Cx8bgUUaP05GUkxPZ/IGFHblEPes596KPzgWhbOInUMrcqkyaVFVNMbyQuUXe1dPGeVCHTg6UaGvRHyJZHfroTK5BFwDlRtNM6RJF+SvJuloDNNeBUjABmDa0YnawIDAQAB";
const TEXT = 'test';

// Utility function to convert Base64 to Uint8Array
function fromBase64(base64) {
    try {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        throw new Error(`Base64 decode failed: ${error.message}`);
    }
}

// Utility function to convert ArrayBuffer to Base64
function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Import public key from Base64-encoded data
 * @param {string} base64 - Base64-encoded public key data
 * @returns {Promise<CryptoKey>} The imported public key
 */
async function importPublicKey(base64) {
    const binary = fromBase64(base64);
    return await crypto.subtle.importKey(
        "spki",  // Public key format
        binary.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,
        ["encrypt"]
    );
}

/**
 * Encrypt text using RSA-OAEP with public key
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
 * Main function to encrypt text and make API request
 */
async function encryptAndRequest() {
    try {
        // Import the public key
        const publicKey = await importPublicKey(PUBLIC_KEY_BASE64);

        // Encrypt the text
        const encryptedBase64 = await rsaEncrypt(TEXT, publicKey);

        // URL encode the encrypted data for query parameter
        const encodedText = encodeURIComponent(encryptedBase64);

        // Build the API URL
        const apiUrl = `https://your-domain.com/api/test-rsa-oaep?text=${encodedText}`;

        console.log('Encrypted text (Base64):', encryptedBase64);
        console.log('API URL:', apiUrl);

        // Make the GET request
        const response = await fetch(apiUrl);
        const result = await response.json();

        console.log('API Response:', result);

        if (result.ok) {
            console.log('Decrypted text:', result.data.decryptedText);
        }

        return result;

    } catch (error) {
        console.error('Encryption/Request failed:', error);
        throw error;
    }
}

async function getEncryptedText() {
    const publicKey = await importPublicKey(PUBLIC_KEY_BASE64);
    const encryptedBase64 = await rsaEncrypt(TEXT, publicKey);
    const encodedText = encodeURIComponent(encryptedBase64);

    console.log('Use this in your URL:', encodedText);
    return encodedText;
}

// Main execution
(async function () {

    await getEncryptedText();

})();