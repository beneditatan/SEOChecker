class FileParser 
{

	parseToString(filePath)
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
					resolve(data);
				}
			})
		})
			
	}
}

module.exports = FileParser;