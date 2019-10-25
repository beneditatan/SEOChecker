const { SEOChecker, HTMLParser } = require('./index.js')

const seochecker = new SEOChecker();
const htmlparser = new HTMLParser();

htmlparser.parseFromFileToHTML('../inputtests/test1.html').then((string) => {
    console.log(string)
}).catch((err) => {
    console.log(err)
})
seochecker.readHTMLByFilePath('<body></body>');
const htmlString = seochecker.getHTMLString();
console.log(htmlString);

