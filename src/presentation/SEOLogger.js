const OutputMode = require('../core/enums/OutputModeEnum');
const { Writable, Readable } = require('stream')

const inLogStream = (logStrings) => {
	const logger = new Readable({
		read() {}
	});

	for (var i = 0; i < logStrings.length; i++)
	{
		logger.push(logStrings[i]);
	}

	logger.push(null);
	return logger;
}

const outLogStream = (outMode, filePath = '') => {
	
	switch(outMode)
	{
		case OutputMode.CONSOLE:
			// console
			return process.stdout;
		case OutputMode.FILE:
			// file
			return fs.createWriteStream(filePath)
		case OutputMode.STREAM:
			// writable stream
			return new Writable({});
		default:
			return process.stdout;
	}
}

module.exports = { inLogStream, outLogStream};