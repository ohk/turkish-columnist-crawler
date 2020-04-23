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
        let author = document.querySelector('h6 > a').getAttribute('title')
        let title = document.querySelector('#metin > h1').innerText
        let date = document.querySelector('div.tarih > div:nth-child(1)').innerText

        /***
         * Clear ads and other posts
         */
        var elements = document.getElementsByClassName('haber-reklam-detay')
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i])
        }

        var elements = document.getElementsByClassName('post-block')
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i])
        }

        let content = document.querySelector('#yazi-reklam').innerText
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
    } else if (limit <= 29) {
        limitv2 = 29
    }
    let objects = []
    try {
        /**
         * Evrensel newspaper has 28 articles on each page.
         */
        for (let index = 0; index < limitv2 / 28; index++) {
            let tmpObj = await page.evaluate(() => {
                let objects = []
                elements = document.querySelectorAll(
                    '#metin > div > div.haber-metin > div > div > div > div > div > ul > li'
                )
                elements.forEach((el) => {
                    objects.push({
                        url: el.children[0].getAttribute('href'),
                        date: el.children[2].innerText
                    })
                })
                return objects
            })
            /**
             * create pages url
             */
            await page.goto(url + '/s/' + (2 + index))

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
        data.externalParams = externalParams
        returnData.push(data)
    }
    browser.close()
    return returnData
}

module.exports = {
    crawl
}
