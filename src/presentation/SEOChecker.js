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
			const ruleChecker = this.ruleStream.checkIMG();
			try 
			{
				this.inStream.pipe(ruleChecker)
							.pipe(this.outStream())
							.on('finish', () => {
								if (this.ruleStream.invalidImages > 0)
								{
									const string = `There are ${this.ruleStream.invalidImages} <img> without alt attribute\n`;
									resolve(string)
								}
								else
								{
									const string = "All <img> have alt attribute\n";
									resolve(string)
								}
								
							})
			}
			catch (err)
			{
				reject(err)
			}
			
		})
	}

	runCheckHREF()
	{
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkHREF();
			try 
			{
				this.inStream.pipe(ruleChecker)
								.pipe(this.outStream())
								.on('finish', () => {
									if (this.ruleStream.invalidHREF > 0)
									{
										const string = `There are ${this.ruleStream.invalidHREF} <a> without rel attribute\n`;
										resolve(string)
									}
									else
									{
										const string = "All <a> have rel attribute\n";
										resolve(string)
									}
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