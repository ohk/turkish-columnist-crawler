String.prototype.replaceAll = function (find, replace) {
    var str = this
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace)
}

function convertText(text) {
    text = text.replaceAll('!', ' ! ')
    text = text.replaceAll('\n', '')
    text = text.replaceAll('"', ' " ')
    text = text.replaceAll('#', ' # ')
    text = text.replaceAll('$', ' $ ')
    text = text.replaceAll('%', ' % ')
    text = text.replaceAll('&', ' & ')
    text = text.replaceAll("'", " ' ")
    text = text.replaceAll('(', ' ( ')
    text = text.replaceAll(')', ' ) ')
    text = text.replaceAll('*', ' * ')
    text = text.replaceAll('+', ' + ')
    text = text.replaceAll(',', ' , ')
    text = text.replaceAll('-', ' - ')
    text = text.replaceAll('.', ' . ')
    text = text.replaceAll('/', ' / ')
    text = text.replaceAll('[', ' [ ')
    text = text.replaceAll('\\', ' \\ ')
    text = text.replaceAll(']', ' ] ')
    text = text.replaceAll('^', ' ^ ')
    text = text.replaceAll('_', ' _ ')
    text = text.replaceAll('`', ' ` ')
    text = text.replaceAll('{', ' { ')
    text = text.replaceAll('|', ' | ')
    text = text.replaceAll('}', ' } ')
    text = text.replaceAll('~', ' ~ ')
    text = text.replaceAll('?', ' ? ')
    text = text.replaceAll(':', ' : ')
    text = text.replaceAll(';', ' ; ')
    text = text.replaceAll('=', ' = ')
    text = text.replaceAll('<', ' < ')
    text = text.replaceAll('>', ' > ')
    text = text.replaceAll('@', ' @ ')
    text = text.replaceAll('…', ' . ')
    text = text.replaceAll('‘', " ' ")
    text = text.replaceAll('’', " ' ")
    text = text.replaceAll('“', ' " ')
    text = text.replaceAll('”', ' " ')
    text = text.replaceAll('”', ' " ')
    text = text.replace(/\s{2,}/g, ' ')
    text = text.replace(/([^!-~\s£₺…‘’“”üÜiİşŞöÖçÇğĞı])/g, '')
    return text
}

module.exports = {
    convertText
}
