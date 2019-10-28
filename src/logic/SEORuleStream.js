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
		this.headerFound = false;
		this.titleFound = false;
		this.descFound = false;
		this.keywordFound = false;
		this.strongCheck = false;
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

	checkHREF(self = this)
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

	checkHeader(self = this)
	{
		return new Transform({
			transform(chunk, encoding, callback) {

				const root = NodeHTMLParser.parse(chunk.toString());
				const header = checkTagExist(root, 'head')

				if (header.length > 0)
				{
					const title = checkTagExist(header[0], 'title')

					if (title.length > 0 )
					{
						self.titleFound = true;
					}

					const metadata = checkTagExist(header[0], 'meta');

					for (var i = 0; i < metadata.length; i++)
					{
						var descFound = checkTagCompleteness(metadata[i], 'name', attrVal = 'descriptions');
						if (!descFound) {
							var keywordFound = checkTagCompleteness(metadata[i], 'name', attrVal = 'keywords')
						}

						self.descFound = descFound;
						self.keywordFound = keywordFound;

						if (self.descFound && self.keywordFound)
						{
							break;
						}
					}
				}
				callback(null, chunk);
			}
		})
	}

	checkStrongTag(number, self = this)
	{
		return new Transform({
			transform(chunk, encoding, callback){
				const root = NodeHTMLParser.parse(chunk.toString());
				const strongs = checkNumberOfTag(root, 'strong')
				self.strongCheck = strongs > number ? false : true;

				callback(null, chunk)
			}
		});
	}



}

module.exports = SEORuleStream;