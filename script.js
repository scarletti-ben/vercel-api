// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

const originToggle = /** @type {HTMLInputElement} */
    (document.getElementById('origin-toggle'));

// < ======================================================
// < Declarations
// < ======================================================

const RELATIVE_URL = 
    '/api/test-cors';

const FULL_URL = 
    'https://vercel-cors-proxy-eight.vercel.app/api/test-cors';

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

/**
 * Entry point for the application (IIFE)
 */
(() => {

    const testers = document.querySelectorAll('.request-tester');
    for (const tester of testers) {

        const button = tester.querySelector('.request-button');
        const output = tester.querySelector('.response-container');

        button.addEventListener('click', async () => {
            const method = button.textContent.trim();
            try {
                const path = originToggle.checked ?  RELATIVE_URL : FULL_URL;
                const response = await fetch(path, { method });
                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = responseText;
                }
                output.textContent = JSON.stringify({
                    status: response.status,
                    statusText: response.statusText,
                    data: data
                }, null, 2);
            } catch (error) {
                output.textContent = JSON.stringify({
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }, null, 2);
            }
        });

    }

})();