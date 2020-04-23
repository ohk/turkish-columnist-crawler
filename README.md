<h1 align="center">Welcome to Turkish Columnist Crawler 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ohkamisli/turkish-columnist-crawler#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ohkamisli/turkish-columnist-crawler/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/ohkamisli/turkish-columnist-crawler/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/ohkamisli/Turkish-Columnist-Crawler" />
  </a>
  <a href="https://www.codacy.com/manual/ohkamisli/turkish-columnist-crawler?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ohkamisli/turkish-columnist-crawler&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/3c439cde2e40429f809e587a0debef9c"/></a>
  <a href="https://twitter.com/ohkamisli" target="_blank">
    <img alt="Twitter: ohkamisli" src="https://img.shields.io/twitter/follow/ohkamisli.svg?style=social" />
  </a>
</p>

> Crawl the columns on newspaper websites.

### 🏠 [Homepage](https://github.com/ohkamisli/turkish-columnist-crawler#readme)

## Install

```sh
npm i turkish-columnist-crawler
```

## Usage

This is a simple use case. See the [Documentation]() section for details.

```
const crawler = require('turkish-columnist-crawler')

let urls = SAMPLE_URL

crawler(url, {
    date: '23 Nisan 1920', // Activate if you want to scan articles written after this date.
    last: false, // Activate only if you want the last article.
    externalParams: null, //Allows you to add things that need to be added to the return data.
    saveDisk: true, //Saves outputs to disk
    limit: -1, //Determines the maximum count of articles to be scanned. If you give -1, it scans a maximum of 100 articles.
    filePath: __dirname + '/texts', // If you set the saveDisk parameter to true, you have to give the entire Path of the folder where the files will be saved.
    strOp: false // If you use this parameter, you will see that there are spaces between all punctuation and words.
})
```

## Author

👤 **Omer Hamid Kamisli**

-   Website: ohkamisli.com
-   Twitter: [@ohkamisli](https://twitter.com/ohkamisli)
-   Github: [@ohkamisli](https://github.com/ohkamisli)
-   LinkedIn: [@ohkamisli](https://linkedin.com/in/ohkamisli)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/ohkamisli/turkish-columnist-crawler/issues).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/ohkamisli">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## 📝 License

Copyright © 2020 [Omer Hamid Kamisli](https://github.com/ohkamisli).<br />
This project is [MIT](https://github.com/ohkamisli/turkish-columnist-crawler/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
