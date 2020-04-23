const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const dParser = require('../external/dateParser')
const strOps = require('../external/stringOps')
const path = require('path')
const scrollPageToBottom = require('puppeteer-autoscroll-down')

async function getData(page, url, filePath, saveDisk, strOp) {
    /**
     * Go to url
     */
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    /**
     * Get content of page
     */
    let data = await page.evaluate(() => {
        let author = document.querySelector('a > span > strong').innerText
        let title = document.querySelector('span > h1').innerText
        let date = document.querySelector('figure > figcaption > span').innerText
        let content = document.querySelector('div:nth-child(1) > div:nth-child(3) > div > div').innerText

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
     * scroll to bottom
     */
    await scrollPageToBottom(page)
    /**
     * Get last Urls
     */
    var docUrl = await page.evaluate(() => {
        let objects = []

        elements = document.querySelectorAll('div.col-sm-12.view20 > div > div')
        console.log(elements)
        elements.forEach((el) => {
            objects.push({
                url: 'https://www.sabah.com.tr/' + el.children[0].children[0].children[0].getAttribute('href'),
                date: el.children[0].children[0].children[0].children[0].innerText
            })
        })
        return objects
    })

    /**
     * filter urls
     */
    for (var index in docUrl) {
        if (limit === -1 || urls.length < limit) {
            if (date === null || date < dParser.convertToDate(docUrl[index].date)) {
                urls.push(docUrl[index].url)
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
        data.externalParams = externalParams
        returnData.push(data)
    }
    browser.close()
    return returnData
}

module.exports = {
    crawl
}
