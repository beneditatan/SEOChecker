const InputMode = require('../core/enums/InputModeEnum');
const OutputMode = require('../core/enums/OutputModeEnum');

class SEOChecker
{
	constructor(config)
	{
		const { inMode, outMode, input } = config;
		this.inMode = inMode;
		this.outMode = outMode;
		this.input = input;
	}

	run()
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