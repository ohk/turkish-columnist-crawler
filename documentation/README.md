<h1 align="center">Welcome to Turkish Columnist Crawler Documentation👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.2-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ohkamisli/turkish-columnist-crawler/blob/master/documentation/README.md" target="_blank">
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

Crawl the columns on newspaper websites.

## Installation

```sh
npm i turkish-columnist-crawler
```

## Sample Usage

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

## Supported Newspapers

1.  www.milliyet.com.tr
2.  www.hurriyet.com.tr
3.  www.sozcu.com.tr

        It gives only 31 Articles.

4.  www.haberturk.com
5.  www.evrensel.net
6.  www.yenicaggazetesi.com.tr
7.  www.turkiyegazetesi.com.tr
8.  www.fanatik.com.tr

        It gives only 10 Articles.

9.  www.takvim.com.tr

        Things to do when getting a url from the Takvim newspaper:

            1. Go to the page with all the articles of the author. You should have get a url like https://www.takvim.com.tr/yazarlar/hakki_yalcin/arsiv.

            2. Then go to page 2. You should have get a url like https://www.takvim.com.tr/yazarlar/hakki_yalcin/arsiv?tc=4321&page=2 . You need to use the url that you get.

10) www.sabah.com.tr

## Options

### Example use of all options:

    {
        date: '23 Nisan 1920',
        last: true,
        externalParams: { authorId: 10001 },
        saveDisk: true,
        limit: -1,
        filePath: __dirname + '/texts',
        strOp: true
    }

### Descriptions of options

1.  Date

    Activate if you want to scan articles written after this date. **Only take STRING**.
    Supported Formats:

        1. DD MM YYYY
        2. D <name of the month> YYYY
        3. All little endian formats

2.  Last

    Activate only if you want the last article. If this option is used, the limit and date options are updated as null. **Only take BOOLEAN**.

3)  External Params

    Allows you to add things that need to be added to the return data. **Take json Object**.

    Sample:

        crawler(url, {
                        date: '23 Nisan 1920',
                        last: true,
                        externalParams: { authorId: 10001 },
                        saveDisk: true,
                        limit: -1,
                        filePath: __dirname + '/texts',
                        strOp: false
                     }
                ).then((data) => console.log(data))

    Output (Some data was deleted to avoid data breach. These are marked as RESTRICTED.):

        {
            author: 'Attila Gökçe',
            title: RESTRICTED,
            date: RESTRICTED,
            content: RESTRICTED,
            filePath: '/Users/omerhamidkamisli/Projects/turkish-columnist-crawler/texts/Attila Gökçe/2020-04-21.txt',
            subUrl: RESTRICTED,
            mainUrl: 'https://www.milliyet.com.tr/yazarlar/attila-gokce/',
            externalParams: { authorId: 10001 }
        }

4)  Save Disk

    Saves outputs to disk. This function does not work if it is not used with the File Path option. **Only take BOOLEAN**

5)  Limit

    Determines the maximum count of articles to be scanned. If you give -1, it scans a maximum of 100 articles. **Only take NUMBER**

6)  File Path

    If you set the saveDisk parameter to true, you have to give the entire Path of the folder where the files will be saved. **Only take STRING**

7)  String Operation

    If you use this parameter, you will see that there are spaces between all punctuation and words. **Only take BOOLEAN**

    Output when option is marked as **FALSE**:

        Mustafa Kemal Atatürk (until 1934: Mustafa Kemal Pasha; after the Surname Law of 1934:

        Kemal Atatürk or alternatively written as Kamâl Atatürk; 1881 – 10 November 1938), was a

        Turkish field marshal, revolutionary statesman, author, and the founder of the Republic of

        Turkey, serving as its first President from 1923 until his death in 1938. His leadership

        undertook sweeping progressive reforms, which modernized Turkey into a secular, industrial

        nation. Ideologically a secularist and nationalist, his policies and theories became known

        as Kemalism. Due to his military and political accomplishments, Atatürk is regarded

        according to studies as one of the greatest leaders of the 20th century.

    Output when option is marked as **TRUE**:

        Mustafa Kemal Atatürk ( until 1934 : Mustafa Kemal Pasha ; after the Surname Law of 1934 :

        Kemal Atatürk or alternatively written as Kaml Atatürk ; 1881  10 November 1938 ) , was a

        Turkish field marshal , revolutionary statesman , author , and the founder of the Republic

        of Turkey , serving as its first President from 1923 until his death in 1938 . His

        leadership undertook sweeping progressive reforms , which modernized Turkey into a secular

        , industrial nation . Ideologically a secularist and nationalist , his policies and

        theories became known as Kemalism . Due to his military and political accomplishments ,

        Atatürk is regarded according to studies as one of the greatest leaders of the 20th

        century .
