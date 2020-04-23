const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const dParser = require('../external/dateParser')
const strOps = require('../external/stringOps')
const path = require('path')

async function getDataSKORER(page, url, filePath, saveDisk, strOp) {
    /**
     * Go to url
     */
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    /**
     * Get content of page
     */
    let data = await page.evaluate(() => {
        let author = document.querySelector('div > h5').textContent
        let title = document.querySelector('div > h1').textContent
        let date = document.querySelector('div.article__time > div:nth-child(1)').textContent
        let content = document.querySelector('div.article__detail').textContent
        return { author, title, date, content }
    })
    /**
     * transform the text to NER format if selected
     */
    if (strOp === true) {
        data.content = strOps.convertText(data.content)
    }
    /**
     * save the text if selected
     */
    if (saveDisk === true) {
        let filename = path.join(filePath + '/' + data.author + '/' + dParser.convertToString(data.date) + '.txt')
        fs.outputFileSync(filename, data.content)
        data.filePath = filename
    }
    data.subUrl = url
    return data
}

async function getData(page, url, filePath, saveDisk, strOp) {
    /**
     * Go to url
     */
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    /**
     * Get content of page
     */
    let data = await page.evaluate(() => {
        let author = document.querySelector('h1 > a').textContent
        let title = document.querySelector('article > h1').textContent
        let date = document.querySelector('div.article__date').textContent
        let content = document.querySelector('div.article__content').textContent
        return { author, title, date, content }
    })
    /**
     * transform the text to NER format if selected
     */
    if (strOp === true) {
        data.content = strOps.convertText(data.content)
    }
    /**
     * save the text if selected
     */
    if (saveDisk === true) {
        let filename = path.join(filePath + '/' + data.author + '/' + dParser.convertToString(data.date) + '.txt')
        fs.outputFileSync(filename, data.content)
        data.filePath = filename
    }
    data.subUrl = url
    return data
}

async function crawl(url, limit, date, filePath, saveDisk, strOp, externalParams) {
    /**
     * create the browser and go to page
     */
    let browser = await puppeteer.launch()
    let page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    /**
     * init objects
     */
    let urls = []
    let returnData = []
    /**
     * Get last Urls
     */
    let limitv2 = limit
    if (limit === -1) {
        limitv2 = 100
    } else if (limit <= 9) {
        limitv2 = 9
    }
    let objects = []
    try {
        /**
         * Milliyet newspaper has 8 articles on each page.
         */
        for (let index = 0; index < limitv2 / 8; index++) {
            let tmpObj = await page.evaluate(() => {
                let objects = []
                elements = document.querySelectorAll('div.col-12.col-md-12.col-lg-8 > div')
                elements.forEach((el) => {
                    objects.push({
                        url: 'https://www.milliyet.com.tr' + el.children[0].children[0].getAttribute('href'),
                        date: el.children[1].textContent
                    })
                })
                return objects
            })
            /**
             * create pages url
             */
            await page.goto(url + '?p=' + (2 + index))

            objects = objects.concat(tmpObj)
        }
    } catch (error) {
        console.log(error)
    }

    /**
     * filter urls
     */
    for (var index in objects) {
        if (limit === -1 || urls.length < limit) {
            if (date === null || date < dParser.convertToDate(objects[index].date)) {
                urls.push(objects[index].url)
            } else {
                break
            }
        } else {
            break
        }
    }

    /**
     * Get Data
     */

    for (let iC = 0; iC < urls.length; iC++) {
        let data
        if (urls[iC].includes('skorer')) {
            data = await getDataSKORER(page, urls[iC], filePath, saveDisk, strOp)
        } else {
            data = await getData(page, urls[iC], filePath, saveDisk, strOp)
        }
        data.mainUrl = url
        data.externalParams = externalParams
        returnData.push(data)
    }
    browser.close()
    return returnData
}

module.exports = {
    crawl
}
