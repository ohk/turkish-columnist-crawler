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
    const saveDisk = options.saveDisk !== undefined ? options.saveDisk : false
    const limit = options.limit !== undefined ? options.limit : 0
    const date = options.date !== undefined ? options.date : null
    const last = options.last !== undefined ? options.last : false
    const filePath = options.filePath !== undefined ? options.filePath : null
    const strOp = options.strOp !== undefined ? options.strOp : false
    const externalParams = options.externalParams !== undefined ? options.externalParams : null

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
            data = await yenicag.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.turkiyegazetesi.com.tr':
            data = await turkiyeGazetesi.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.fanatik.com.tr':
            data = await fanatik.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.takvim.com.tr':
            data = await takvim.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        case 'www.sabah.com.tr':
            data = await sabah.crawl(url, limit, date, filePath, saveDisk, strOp, externalParams)
            break
        default:
            break
    }

    return data
}
