class HTMLParser 
{
	constructor()
	{
		this.parserModule = require('node-html-parser')
	}

	parseFromFileToHTML(filePath)
	{
		//-- works with relative input
		//-- returns HTML Elements
		
		return new Promise((resolve, reject) => {
			var fs = require('fs');
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err)
				{
					reject(err);
				} else {
					const htmlObj = this.parserModule.parse(data);
					resolve(htmlObj);
				}
			})
		})
			
	}

	parseFromReadStreamToHTML(stream)
	{

	}
}

module.exports = HTMLParser;