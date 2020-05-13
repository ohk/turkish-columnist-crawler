const sozcu = require('./newspaper/sozcu')
const hurriyet = require('./newspaper/hurriyet')
const milliyet = require('./newspaper/milliyet')
const haberturk = require('./newspaper/haberturk')
const evrensel = require('./newspaper/evrensel')
const yenicag = require('./newspaper/yenicag')
const turkiyeGazetesi = require('./newspaper/turkiyeGazetesi')
const fanatik = require('./newspaper/fanatik')
const takvim = require('./newspaper/takvim')
const sabah = require('./newspaper/sabah')

const dParser = require('./external/dateParser')

module.exports = async (url, options) => {
    let saveDisk = options.saveDisk !== undefined ? options.saveDisk : false
    let limit = options.limit !== undefined ? options.limit : 0
    let date = options.date !== undefined ? options.date : null
    let last = options.last !== undefined ? options.last : false
    let filePath = options.filePath !== undefined ? options.filePath : null
    let strOp = options.strOp !== undefined ? options.strOp : false
    let externalParams = options.externalParams !== undefined ? options.externalParams : null

    if (saveDisk === true && filePath === null) {
        return 'File path can not be null'
    }

    if (last === true) {
        limit = 1
        date = null
    }
    if (date !== null) {
        date = new Date(dParser.convertToDate(date, 'date'))
    }
    let data
    const domain = new URL(url)
    switch (domain.host) {
        case 'www.milliyet.com.tr':
            data = await milliyet.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.hurriyet.com.tr':
            data = await hurriyet.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.sozcu.com.tr':
            data = await sozcu.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.haberturk.com':
            data = await haberturk.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.evrensel.net':
            data = await evrensel.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.yenicaggazetesi.com.tr':
            urlYeni = url.slice(0, -4)
            data = await yenicag.crawl(urlYeni, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.turkiyegazetesi.com.tr':
            data = await turkiyeGazetesi.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.fanatik.com.tr':
            data = await fanatik.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.takvim.com.tr':
            urlTakvim = url.slice(0, -7)
            data = await takvim.crawl(urlTakvim, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.sabah.com.tr':
            data = await sabah.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        default:
            break
    }

    return data
}
