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
        let author = document.querySelector('span > strong').innerText
        let title = document.querySelector('#article_holder > h1').innerText
        let date = document.querySelector('#article_holder > p').innerText

        /***
         * Clear author infos
         */
        var elements = document.getElementsByClassName('icerikyazar')
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i])
        }

        let content = document.querySelector('#article_body').innerText
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
    } else if (limit <= 12) {
        limitv2 = 13
    }
    let objects = []
    try {
        /**
         * Yenicag newspaper has 12 articles on each page.
         */
        for (let index = 0; index < limitv2 / 12; index++) {
            let tmpObj = await page.evaluate(() => {
                let objects = []
                elements = document.querySelectorAll('#yazar-makaleler > tbody > tr')
                elements.forEach((el) => {
                    objects.push({
                        url: el.children[0].children[0].children[0].getAttribute('href'),
                        date: el.children[1].children[0].innerText
                    })
                })
                return objects
            })
            /**
             * create pages url
             */
            await page.goto(url + '/' + (2 + index))
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
        console.log(data)
        returnData.push(data)
    }
    browser.close()
    return returnData
}

module.exports = {
    crawl
}
