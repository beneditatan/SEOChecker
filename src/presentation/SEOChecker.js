const InputMode = require('../core/enums/InputModeEnum');
const fs = require('fs');
const SEORuleStream = require('../logic/SEORuleStream');
const { Writable } = require('stream');

class SEOChecker
{
	constructor(config)
	{
		const { 
			inMode, 
			filePath,
			readableStream } = config;
		this.inMode = inMode;
		this.inStream = inMode === InputMode.STREAM ? readableStream : fs.createReadStream(filePath);
		this.ruleStream = new SEORuleStream();
		this.outStream = () => {
			return new Writable({
				write(chunk, encoding, callback){
					callback();
				}
			})
		}
	}

	runCheckIMG()
	{
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkIMG;
			try 
			{
				this.inStream.pipe(ruleChecker())
							.pipe(this.outStream())
							.on('finish', () => {
								const string = `Invalid images: ${this.ruleStream.invalidImages}\n`;
								resolve(string)
							})
			}
			catch (err)
			{
				reject(err)
			}
			
		})
	}
}

module.exports = SEOChecker;