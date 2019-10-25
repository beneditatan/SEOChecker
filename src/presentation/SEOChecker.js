const InputMode = require('../core/enums/InputModeEnum');
const OutputMode = require('../core/enums/OutputModeEnum');
const HTMLParser = require('../logic/HTMLParser');

class SEOChecker
{
	constructor(config)
	{
		const { inMode, outMode } = config;
		this.inMode = inMode;
		this.outMode = outMode;
		this.htmlInput = null;
	}

	setInputMode(inMode = InputMode.FILE)
	{
		this.inMode = inMode;
	}

	setInput(htmlInput)
	{
		const Parser = new HTMLParser();
		
		switch(this.inMode)
		{
			case InputMode.FILE:
				var parserAsync = Parser.parseFileToHTML;
				break;
			case InputMode.STREAM:
				var parserAsync  = null;
				break;
			default:
				var parserAsync  = Parser.parseFileToHTML;
				break;
		}

		return new Promise((resolve, reject) => {
			parserAsync(htmlInput).then((data) => {
				this.htmlInput = data;
				resolve(true);
			}).catch((err) => {
				console.log(err)
				reject(err);
			})
		})
	}

	setOutputMode(outMode = OutputMode.FILE)
	{
		this.outMode = outMode;
	}

	setRules()
	{

	}

	run(htmlInput)
	{
		return new Promise((resolve, reject) => {
			this.setInput(htmlInput).then((success) => {
				if (success)
				{
					console.log(this.htmlInput)
					resolve(success);
				}
			}).catch((err) => {
				console.log(err);
				reject(err);
			})
		});
	}
}

module.exports = SEOChecker;