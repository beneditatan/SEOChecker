class HTMLParser
{
	constructor() 
	{
		this.fileParser = require('../persistent/FileParser');
		this.nodeHtmlParser = require('node-html-parser');
	}

	parseFileToHTML(filepath)
	{
		return new Promise((resolve, reject) => {
			this.fileParser.parseToString(filepath).then((data) => {
				const htmlElement = this.nodeHtmlParser(data);
				resolve(htmlElement);
			}).catch((err) => {
				reject(err);
			})
		})
	}
}

module.exports = HTMLParser;