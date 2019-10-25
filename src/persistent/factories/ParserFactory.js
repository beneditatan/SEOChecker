class ParserFactory
{
	constructor()
	{
		this.FileParser = require('../FileParser');
		this.StreamParser = require('../StreamParser');
	}

	getParserInstance(parserId)
	{
		switch(parserId)
		{
			case 0:
				return new this.FileParser();
			case 1:
				return new this.StreamParser();
			default:
				return new this.FileParser();
		}
	}
}

module.exports = ParserFactory;