const package = require('./index.js')
const SEOChecker = package.SEOChecker;

const seochecker = new SEOChecker();

seochecker.readHTMLByFilePath('<body></body>');
const htmlString = seochecker.getHTMLString();
console.log(htmlString);

