const { chromium } = require('playwright');

(async () => {
    // Launch browser in headless mode
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let grandTotal = 0;

    console.log('Starting automated QA scraping for Seeds 9-18...\n');

    // Loop through the new seeds: 9 to 18
    for (let i = 9; i <= 18; i++) {
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${i}`;
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            
            // Wait for the dynamic JS table to render
            await page.waitForSelector('td', { timeout: 10000 });
            
            // Extract and sum all valid numbers in the table
            const pageSum = await page.evaluate(() => {
                const cells = Array.from(document.querySelectorAll('td'));
                return cells.reduce((sum, cell) => {
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

    // Print the final result in the logs
    console.log(`\n================================`);
    console.log(`GRAND TOTAL SUM: ${grandTotal}`);
    console.log(`================================\n`);

    await browser.close();
})();
