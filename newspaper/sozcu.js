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
        let author = document.querySelector('div.news-cat > a:nth-child(2)').textContent
        let title = document.querySelector('h1').textContent
        let date = document.querySelector('div.editor-col._flex._aic > div > div > span').textContent
        let content = document.querySelector('div.author-the-content.content-element').innerText

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
    var docUrl = await page.evaluate(() => {
        let objects = []

        elements = document.querySelectorAll('div.news-body > ul > li')
        console.log(elements)
        elements.forEach((el) => {
            objects.push({
                url: el.children[0].getAttribute('href'),
                date: el.children[0].children[1].innerText
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
