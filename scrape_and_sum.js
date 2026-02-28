const { chromium } = require('playwright');

(async () => {
    // Launch browser in headless mode (default)
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let grandTotal = 0;

    console.log('Starting automated QA scraping...\n');

    // Loop through seeds 40 to 49
    for (let i = 40; i <= 49; i++) {
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${i}`;
        
        try {
            // Navigate to the page
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            
            // CRITICAL: Wait for the dynamic JS table to render by waiting for a 'td' element
            await page.waitForSelector('td', { timeout: 10000 });
            
            // Extract all text from table data cells and sum the valid numbers
            const pageSum = await page.evaluate(() => {
                const cells = Array.from(document.querySelectorAll('td'));
                return cells.reduce((sum, cell) => {
                    // Remove any formatting (like commas or currency signs) and parse as float
                    const value = parseFloat(cell.innerText.replace(/[^0-9.-]+/g, ""));
                    return !isNaN(value) ? sum + value : sum;
                }, 0);
            });

            console.log(`Sum for seed ${i}: ${pageSum}`);
            grandTotal += pageSum;
            
        } catch (error) {
            console.error(`Error processing seed ${i} at ${url}:`, error.message);
        }
    }

    // Print the final result in the logs as requested
    console.log(`\n================================`);
    console.log(`GRAND TOTAL SUM: ${grandTotal}`);
    console.log(`================================\n`);

    await browser.close();
})();
