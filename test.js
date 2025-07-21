// RSA Encrypt/Decrypt Script
// Usage: Include in HTML with <script src="script.js"></script>

const INPUT_TEXT = 'test';

// Hardcoded RSA key pair (2048-bit)
const PUBLIC_KEY_BASE64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt9lWvcNEYSkxRq5V1lccfbEw/lTYHh1m3vP8lgmda3l14+AGWTRgS6QHM6foCYK754Jf4mxXG3atQCwz9SXPqy8YgBsV3U6XQPUqKBGx0d8w9NPgaPnH9NO2UTi9HbY1yOBU7XokZn68dxqWQvpxTZ2a00ZDPOlMrxS6qH2ii/VWpXMx242qD0yFwk0MTMzlgsQXjtv2onFP+RwbUpfxIC0AWesm8Skj+7j51GN/Kh6bI6sWezt/feBNCfn075koOBIBiWh+PFQukM7fGaPvn9TIRhkSvoc5kwRyxnaqUlGNykPKSy7+uBoTOO4+4WmRA6HwKJ6sMXaUOxiNciq00wIDAQAB";
const PUBLIC_KEY_ALTERNATE = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxLp2mik3V6aiRSMuaWOemvV1k3goDhmNRnwQhcrulOHQTBG9JYetfHKrtZZYEvVzV1a5fU/hM9gT9QlYX2epHZXyiJhAzG+8fQBNl/Gx206MwOo/c+z0OVzYMqL4rVDUYwLeD8TZJ13h52G0lPGw+rjck1L+okcglmXelMAmbgnuwQdBThWggK9CYRrusQ7pUKf3F7aRd1ZTsSvDcyv8uTKf4Cx8bgUUaP05GUkxPZ/IGFHblEPes596KPzgWhbOInUMrcqkyaVFVNMbyQuUXe1dPGeVCHTg6UaGvRHyJZHfroTK5BFwDlRtNM6RJF+SvJuloDNNeBUjABmDa0YnawIDAQAB"
const PRIVATE_KEY_BASE64 = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC32Va9w0RhKTFGrlXWVxx9sTD+VNgeHWbe8/yWCZ1reXXj4AZZNGBLpAczp+gJgrvngl/ibFcbdq1ALDP1Jc+rLxiAGxXdTpdA9SooEbHR3zD00+Bo+cf007ZROL0dtjXI4FTteiRmfrx3GpZC+nFNnZrTRkM86UyvFLqofaKL9ValczHbjaoPTIXCTQxMzOWCxBeO2/aicU/5HBtSl/EgLQBZ6ybxKSP7uPnUY38qHpsjqxZ7O3994E0J+fTvmSg4EgGJaH48VC6Qzt8Zo++f1MhGGRK+hzmTBHLGdqpSUY3KQ8pLLv64GhM47j7haZEDofAonqwxdpQ7GI1yKrTTAgMBAAECggEAUa60/MOsdlSkaYhcZ8o1RNz8bQtKJ/sdMPKLJygnclA5IiDvASQlooXCk19G1y7oCGBi9Ij5HKEaMXhSL1l4zlAy3Pvrt3NK/VfPvpS6AgpdSHF4c3uCrRKBHs4MLA7AD7sn0IjjckxdtLcxyplVzMu4taSyi/YFlYYqtmB3XyHEbTy3JK87kwFS3bGAVByWD/8qW3QVnh84i4Lf9i0dzzko4um2pPFrIDnuox15XbTP4iqvoIMYSO2j2EkSDX5+ygcsE9FWA6z7IZiIKFMyUFb5+oivZGfNo+XcmFu30ZHBFtyjRcgZ6o2WNEEbNkBGgrHbVnlftl3S2t8qa7z50QKBgQDwbNbSKI7XRRLsDsHZjsbkJaLOBiHRLY3/lFgRCERaCVhUi8Mz27tuAwZD5O5ALud6XqOrwocKEK/V33rrjPYSkY1heAueVXbFk763Mffk+377Rw1BtwhwaVghuKAvHUAfpQQs8RtF9pmaQxcGEaOhXQrKm+Ju+xbdz3BF3BMjgwKBgQDDwkCOVkkFWbXzXtR3Qc6USjrNhJvN+8jSh7yMt/qtXFKcUm9GGtbm07/VeeQQgoJH6oItLi+CJxZWeCbpbirTWr2Po99yDy9Tl7U6J2khDWWFu6DAxsshYkw4c8PC+lvulPYqWEsa3TEuDv8F/+1IQsSDTwktCreRl/taMgFYcQKBgQDG9LpclTWHTODYuWmPOIi8Gaz9IrPvXuxIGKE8DwRJIbyX0kSJ8IbNBfG0U4kZUfc6G4EDzOlk2eQ4b0RQEok7WnmNtAKhVwX/gEDtZotGURyGogiFXgq8w2AsH5VnB6SdyzeGXUt9fRElR+mQmx42lUEt4wvhXSVSDqxRE0o/MwKBgBQAPOhOGJfbWqPLBJpKtvifvPJSojihiRs5kyItigc8b5RZN9VJ2Lss12TQV2T4cKc4ZqSHG4OIytd63z7qaqW9l7CdZa8ZrhQ0Y+fVLwCZhc3sJbiMlySKDo+WBGJfghUWUzBwZPwRrXyvO485Xt0LNVjVMnLPrYHKrXvBsDGBAoGAHRK+FuJ3YGrz3Eo1W7VvgPxZjTaGxTVuaIHUwEjwxhKX+FsSUNwLzGOGbeN7Oh/bactLVFyI3XrQURa5sASzzffgbRi3fpQcN+rBqC1BKkkKArVY1BYi3Qi2LrEz920ffHVNqGyTGKTNV6RNCJIRCBJOOSu7RtJKOfbnghnirPw=";

// Import RSA key from base64
async function importKey(base64, type) {
    const binaryString = atob(base64);
    const binary = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        binary[i] = binaryString.charCodeAt(i);
    }

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

// Encrypt text using RSA-OAEP
async function rsaEncrypt(text, publicKey) {
    const inputBytes = new TextEncoder().encode(text);
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        inputBytes
    );

    // Convert to base64
    const encryptedArray = new Uint8Array(encryptedBuffer);
    return btoa(String.fromCharCode(...encryptedArray));
}

// Decrypt RSA-OAEP encrypted data
async function rsaDecrypt(encryptedBase64, privateKey) {
    // Convert base64 to binary
    const encryptedBinary = atob(encryptedBase64);
    const encryptedArray = new Uint8Array(encryptedBinary.length);
    for (let i = 0; i < encryptedBinary.length; i++) {
        encryptedArray[i] = encryptedBinary.charCodeAt(i);
    }

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedArray.buffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// Main execution
(async function () {
    try {
        console.log('=== RSA Encrypt/Decrypt Demo ===');
        console.log('Input Text:', INPUT_TEXT);

        // Import keys
        const publicKey = await importKey(PUBLIC_KEY_ALTERNATE, "public");
        const privateKey = await importKey(PRIVATE_KEY_BASE64, "private");

        // Encrypt
        const encryptedData = await rsaEncrypt(INPUT_TEXT, publicKey);
        console.log('Encrypted (Base64):', encryptedData);

        const safeData = encodeURIComponent(encryptedData);
        console.log('Safe string:', safeData);

        // Decrypt
        const OUTPUT_TEXT = await rsaDecrypt(encryptedData, privateKey);
        console.log('Decrypted Text:', OUTPUT_TEXT);

        // Verify
        console.log('Encryption/Decryption Success:', INPUT_TEXT === OUTPUT_TEXT);

    } catch (error) {
        console.error('RSA Operation Failed:', error);
    }
})();