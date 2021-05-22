const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {
    let browser = null
    let theTitle = null
	const url = 'https://bookoutlet.ca/Store/Browse?Nc=31&Nw=0&size=24&sort=popularity_0&Ns=600'

    console.log('spawning chrome headless')
    try {
        const executablePath = await chromium.executablePath
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ];
        const options = {
            args,
            headless: true,
            ignoreHTTPSErrors: true,
            userDataDir: './tmp'
        };




        // setup
        browser = await puppeteer.launch(options)

        const page = await browser.newPage()
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] })
        // await page.waitForSelector('a.line-clamp-2')

        theTitle = await page.title()

        // const results = await page.evaluate(() => {
        // 	let titleNodeList = document.querySelectorAll('a.line-clamp-2')
        //     const titleList = []
        //     titleNodeList.forEach(title => titleList.push(title.dataset.text))
        // 	return titleList
        // })

        console.log('done on page', theTitle)

    } catch (error) {
        console.log('error', error)

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error
            })
        }
    } finally {
        //--- Close browser
        if(browser !== null) {
            await browser.close()
        }
    }


    return {
    	statusCode: 200,
    	body: JSON.stringify({
    		message: 'Completed Scraping',
    		title: theTitle,
    	})
    }
}