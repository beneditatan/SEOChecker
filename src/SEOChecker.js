class SEOChecker 
{   
    constructor() {
        this.htmlString = '';
        this.readMode = null;
    }

    readHTMLByFilePath(filePath) {
        // const fs = require('fs')

        // // TODO: return as promise
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     this.htmlString = data;
        // })
        this.htmlString = filePath;
        
    }

    readHTMLByReadableStream() {

    }

    getHTMLString(){
        return this.htmlString
    }
    
}

module.exports = SEOChecker;