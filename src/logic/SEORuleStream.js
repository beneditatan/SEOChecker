const NodeHTMLParser = require('node-html-parser');
const { Transform } = require('stream');
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

	checkIMG(self = this)
	{
		return new Transform({
			transform(chunk, encoding, callback) {
				var root = NodeHTMLParser.parse(chunk.toString())
				var images = checkTagExist(root, 'img');
				for (var i = 0; i < images.length; i++)
				{
						var valid = checkTagCompleteness(images[i], 'alt')
						self.invalidImages = valid ? self.invalidImages : self.invalidImages + 1;
				}
		
				callback(null, chunk);
			}
		});
	}

	checkHREF (self = this)
	{
		return new Transform({
			
			transform(chunk, encoding, callback) {
				
				var root = NodeHTMLParser.parse(chunk.toString())
				var hrefs = checkTagExist(root, 'a')
	
				for (var i = 0; i < hrefs.length; i++)
				{
					var valid = checkTagCompleteness(hrefs[i], 'rel');
					self.invalidHREF = valid ? self.invalidHREF : self.invalidHREF + 1;
				}
				
				callback(null, chunk);
			}
		});
	}
}

module.exports = SEORuleStream;