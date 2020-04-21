const sozcu = require('./newspaper/sozcu')
const hurriyet = require('./newspaper/hurriyet')
const dParser = require('./external/dateParser')

module.exports = (url, options) => {
    const saveDisk = options.save !== undefined ? options.save : false
    const limit = options.limit !== undefined ? options.limit : 0
    const date = options.date !== undefined ? options.date : null
    const last = options.last !== undefined ? options.last : false
    const filePath = options.filePath !== undefined ? options.filePath : null
    if (saveDisk === true && filePath === null) {
        return 'File path can not be null'
    }
    if (last === true) {
        limit = 1
        date = null
    }
    date = new Date(dParser(date, 'date'))

    const domain = new URL(url)
    switch (domain) {
        case 'www.sozcu.com.tr':
            return sozcu(url, limit, date, filePath, saveDisk)
        default:
            break
    }
}
