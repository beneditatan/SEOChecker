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
		
		// if input is a file path, create a readable stream from the filepath
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
									const logData = {
										data: [
											{
												defect: true,
												logString: `There are ${this.ruleStream.invalidImages} <img> without alt attribute\n`
											}
										]
									}
									resolve(logData)
								}
								else
								{
									const logData = {
										data: [
											{
												defect: false,
												logString: "All <img> have alt attribute\n"
											}
										]
									}
									resolve(logData)
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
										const logData = {
											data: [
												{
													defect: true,
													logString: `There are ${this.ruleStream.invalidHREF} <a> without rel attribute\n`
												}
											]
										}
										resolve(logData)
									}
									else
									{
										const logData = {
											data: [
												{
													defect: false,
													logString: "All <a> have rel attribute\n"
												}
											]
										}

										resolve(logData)
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
												const logData = {
													data: []
												}

												if (this.ruleStream.titleFound)
												{
													const logObj = {
														defect: false,
														logString: `This HTML has <title> tag\n`
													}
													logData.data.push(logObj);
												}
												else 
												{
													const logObj = {
														defect: true,
														logString: `This HTML is without <title> tag\n`
													}
													logData.data.push(logObj);
												}

												if (this.ruleStream.keywordFound)
												{
													const logObj = {
														defect: false,
														logString: `This HTML has <meta name='keywords'> tag\n`
													}
													logData.data.push(logObj);
												}
												else
												{
													const logObj = {
														defect: true,
														logString: `This HTML is without <meta name='keywords'> tag\n`
													}
													logData.data.push(logObj);
												}

												if (this.ruleStream.descFound)
												{
													const logObj = {
														defect: false,
														logString: `This HTML has <meta name='descriptions'> tag\n`
													}
													logData.data.push(logObj);
												}
												else
												{
													const logObj = {
														defect: true,
														logString: `This HTML is without <meta name='descriptions'> tag\n`
													}
													logData.data.push(logObj);
												}

												resolve(logData);
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
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkStrongTag(number);

			try
			{
				this.inStream.pipe(ruleChecker)
											.pipe(this.outStream())
											.on('finish', () => {
												if (this.ruleStream.strongCheck)
												{
													const logData = {
														data: [
															{
																defect: false,
																logString: `This HTML does not have more than ${number} <strong> tag\n`
															}
														]
													}
													resolve(logData);
												}
												else
												{
													const logData = {
														data: [
															{
																defect: true,
																logString: `This HTML has more than ${number} <strong> tag\n`
															}
														]
													}
													resolve(logData);
												}
											})
			
			}
			catch (err)
			{
				reject(err);
			}
		})
	}

	runCheckH1Tag()
	{
		return new Promise((resolve, reject) => {
			const ruleChecker = this.ruleStream.checkH1Tag();

			try
			{
				this.inStream.pipe(ruleChecker)
											.pipe(this.outStream())
											.on('finish', () => {
												if (this.ruleStream.headerCheck)
												{
													const logData = {
														data: [
															{
																defect: false,
																logString: `This HTML has exactly 1 <h1> tag\n`
															}
														]
													}
													resolve(logData);
												}
												else 
												{
													const logData = {
														data: [
															{
																defect: true,
																logString: `This HTML has more or less than 1 <h1> tag\n`
															}
														]
													}
													resolve(logData);
												}
											})
			}
			catch(err)
			{
				reject(err);
			}
		})
	}
}

module.exports = SEOChecker;