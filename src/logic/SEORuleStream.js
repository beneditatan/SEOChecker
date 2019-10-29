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
		this.headerCheck = false;
	}

	checkIMG(self = this)
	{
		return new Transform({
			transform(chunk, encoding, callback) {
				var root = NodeHTMLParser.parse(chunk.toString())
				var images = checkTagExist(root, 'img');
				for (var i = 0; i < images.length; i++)
				{

					// check if each image tag has 'alt' attribute
					var valid = checkTagCompleteness(images[i], 'alt')

					// count the invalid images
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
					// check if every 'a' tag has 'rel' attribute
					var valid = checkTagCompleteness(hrefs[i], 'rel');

					// count invalid 'a' tag
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

				// check if html file has header after all
				// if html doesnt have header, titleFound, descFound, and keywordFound will be left false
				if (header.length > 0)
				{
					// check if there's title in header, assuming there's only 1 header
					const title = checkTagExist(header[0], 'title')

					if (title.length > 0 )
					{
						self.titleFound = true;
					}

					// get all meta tags in header
					const metadata = checkTagExist(header[0], 'meta');

					for (var i = 0; i < metadata.length; i++)
					{
						// check if it's a description metadata
						var descFound = checkTagCompleteness(metadata[i], 'name', attrVal = 'descriptions');

						// if it's not a description metadata, check if it's a keyword metadata
						if (!descFound) {
							var keywordFound = checkTagCompleteness(metadata[i], 'name', attrVal = 'keywords')
						}

						self.descFound = descFound;
						self.keywordFound = keywordFound;

						if (self.descFound && self.keywordFound)
						// if both are found, stop checking
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

	checkH1Tag(self = this)
	{
		return new Transform({
			transform(chunk, encoding, callback){
				const root = NodeHTMLParser.parse(chunk.toString());
				const headers = checkNumberOfTag(root, 'h1')
				
				// if header is less or more than 1, html is considered invalid
				self.headerCheck = headers !== 1 ? false : true;

				callback(null, chunk)
			}
		});
	}

}

module.exports = SEORuleStream;