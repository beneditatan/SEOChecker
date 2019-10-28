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

	runCheckHeader()
	{
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkHeader();
			try
			{
				this.inStream.pipe(ruleChecker)
											.pipe(this.outStream())
											.on('finish', () => {
												let logString = [];
												if (this.ruleStream.titleFound)
												{
													const string = `This HTML has <title> tag\n`;
													logString.push(string);
												}
												else 
												{
													const string = `This HTML is without <title> tag\n`
													logString.push(string);
												}

												if (this.ruleStream.keywordFound)
												{
													const string = `This HTML has <meta name='keywords'> tag\n`
													logString.push(string);
												}
												else
												{
													const string = `This HTML is without <meta name='keywords'> tag\n`
													logString.push(string);
												}

												if (this.ruleStream.descFound)
												{
													const string = `This HTML has <meta name='descriptions'> tag\n`
													logString.push(string);
												}
												else
												{
													const string = `This HTML is without <meta name='descriptions'> tag\n`
													logString.push(string);
												}

												resolve(logString.join(""));
											})
			}
			catch (err)
			{
				reject(err)
			}
		})
	}

	runCheckStrongTag(number)
	{
		const outStream = () => {
			return new Writable({
				write(chunk, encoding, callback){
					callback();
				}
			})
		}
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkStrongTag(number);

			try
			{
				this.inStream.pipe(ruleChecker)
											.pipe(outStream())
											.on('finish', () => {
												if (this.ruleStream.strongCheck)
												{
													const string = `This HTML does not have more than ${number} <strong> tag\n`;
													resolve(string);
												}
												else
												{
													const string = `This HTML has more than ${number} <strong> tag\n`;
													resolve(string);
												}
											})
			
			}
			catch (err)
			{
				reject(err);
			}
		})
	}
}

module.exports = SEOChecker;