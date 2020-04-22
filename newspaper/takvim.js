const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const dParser = require('../external/dateParser')
const strOps = require('../external/stringOps')
const path = require('path')

async function getData(page, url, filePath, saveDisk, strOp) {
    /**
     * Go to url
     */
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    /**
     * Get content of page
     */
    let data = await page.evaluate(() => {
        let author = document.querySelector('div.title > a > span:nth-child(1)').textContent
        let title = document.querySelector('#haberTitle').textContent
        let date = document.querySelector('div.info > ul > li:nth-child(1)').textContent
        let content = document.querySelector('#haberDescription').textContent
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

async function crawl(url, limit, date, filePath, saveDisk, strOp) {
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
    }
    let objects = []
    try {
        /**
         * Hurriyet newspaper has 8 articles on each page.
         */
        for (let index = 0; index < limitv2 / 8; index++) {
            let tmpObj = await page.evaluate(() => {
                let objects = []
                elements = document.querySelectorAll('div.otherWriters > ul > li')
                elements.forEach((el) => {
                    objects.push({
                        url: 'https://www.takvim.com.tr/' + el.children[0].children[0].getAttribute('href'),
                        date: el.children[0].children[1].innerText
                    })
                })
                return objects
            })
            /**
             * create pages url
             */
            await page.goto(url + '&page=' + (2 + index))

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
        let data = await getData(page, urls[iC], filePath, saveDisk, strOp)
        data.mainUrl = url
        returnData.push(data)
    }
    browser.close()
    return returnData
}

module.exports = {
    crawl
}
