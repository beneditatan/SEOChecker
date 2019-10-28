const NodeHTMLParser = require('node-html-parser');
const {
	checkNumberOfTag,
	checkTagCompleteness,
	checkTagExist
} = require('./HTMLChecker.js')

class SEORuleStream
{
	constructor()
	{
		this.invalidImages = 0;
		this.invalidHREF = 0;
	}

	checkIMG()
	{
		return new Transform({
			transform(chunk, encoding, callback) {
				var root = NodeHTMLParser.parse(chunk.toString())
				var images = checkTagExist(root, 'img');
				for (var i = 0; i < images.length; i++)
				{
						var valid = checkTagCompleteness(images[i], 'alt')
						this.invalidImages = valid ? this.invalidImages : this.invalidImages + 1;
				}
		
				callback(null, chunk);
			}
		});
	}

	checkHREF ()
	{
		return new Transform({
			transform(chunk, encoding, callback) {
				var root = NodeHTMLParser.parse(chunk.toString())
				var hrefs = checkTagExist(root, 'a')
	
				for (var i = 0; i < hrefs.length; i++)
				{
					var valid = checkTagCompleteness(hrefs[i], 'rel');
					this.invalidHREF = valid ? this.invalidHREF : this.invalidHREF + 1;
				}
				
				callback(null, chunk);
			}
		});
	}
}

module.exports = SEORuleStream;