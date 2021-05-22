const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

	const url = 'https://bookoutlet.ca/Store/Browse?Nc=31';


	const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});

    await page.goto(url);
    await navigationPromise;

    const results = await page.evaluate(() => {
    	let titleNodeList = document.querySelectorAll('a.line-clamp-2');
        const titleList = [];
        titleNodeList.forEach(title => titleList.push(title.dataset.text));
    	return titleList;
    });

    await browser.close();

    console.log(results);

    return {
    	statusCode: 200,
    	body: JSON.stringify({
    		message: 'Completed Scraping',
    		content: results,
    	})
    }
}