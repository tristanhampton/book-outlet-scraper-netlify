const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {
    let browser = null
    let theTitle = null
	const url = 'https://bookoutlet.ca/Store/Browse?Nc=31'

    console.log('spawning chrome headless')
    try {
        const executablePath = await chromium.executablePath

        // setup
        browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: executablePath,
          headless: chromium.headless,
        })

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