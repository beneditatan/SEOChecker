const FileParser = require('../persistent/FileParser.js');
const NodeHTMLParser = require('node-html-parser')

class HTMLParser
{
	parseFileToHTML(filepath)
	{
		return new Promise((resolve, reject) => {
			const fileParser = new FileParser();
			fileParser.parseToString(filepath).then((data) => {
				const htmlElement = NodeHTMLParser.parse(data);
				resolve(htmlElement);
			}).catch((err) => {
				console.log(err);
				reject(err);
			})
		})
	}
}

module.exports = HTMLParser;