const { SEOChecker, HTMLParser } = require('./index.js')


const htmlparser = new HTMLParser();

htmlparser.parseFromFileToHTML('../inputtests/test1.html').then((result) => {
    const seochecker = new SEOChecker(result);
    console.log(seochecker.htmlObj)
}).catch((err) => {
    console.log(err)
})


