const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

	const url = 'https://bookoutlet.ca/Store/Browse?Nc=31&Nw=0&size=24&sort=popularity_0&Ns=600';


	const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(url);

    booktitle = await page.evaluate(() => {
    	return document.querySelector('.title > a').dataset.text;
    });

    await browser.close();

    return {
    	statusCode: 200,
    	body: JSON.stringify({
    		message: 'Completed Scraping',
    		content: 'bookTitle'
    	})
    }
}