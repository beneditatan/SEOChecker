const { inLogStream, outLogStream } = require('../logic/LogStream');
const OutputMode = require('../core/enums/OutputModeEnum');

const getLogStrings = (logArr, verbosity) => {
	// verbosity == 0 => only defects
	// verbosity == 1 => all checking results (both defect == true and defect == false)
	
	let logStrings = [];

	// logArr might be an array or an object
	if (Array.isArray(logArr))
	{
		for(var i = 0; i < logArr.length; i++)
		{
			for(var j = 0; j < logArr[i].data.length; j++)
			{
				const verbosityCheck = verbosity == 0 ? logArr[i].data[j].defect : true;
				if (verbosityCheck)
				{
					const string = logArr[i].data[j].logString;
					logStrings.push(string)
				}
			}
		}
	}
	else 
	{
		for(var j = 0; j < logArr.data.length; j++)
			{
				const verbosityCheck = verbosity == 0 ? logArr.data[j].defect : true;
				if (verbosityCheck)
				{
					logStrings.push(logArr.data[j].logString)
				}
			}
	}

	return logStrings;
}

const logger = (config) => {
	const { logArr, outMode } = config;
	const { verbosity } = 'verbosity' in config ? config : { verbosity: 0 };
	const { filePath } = 'filePath' in config ? config : { filePath : '' };
	const { writeFunc } = 'writeFunc' in config ? config : { writeFunc : null };

	const logStrings = getLogStrings(logArr, verbosity);
	const readStream = inLogStream(logStrings);

	switch(outMode)
	{
		case OutputMode.CONSOLE:
			var writeStream = outLogStream(outMode);
			break;
		case OutputMode.FILE:
			var writeStream = outLogStream(outMode, filePath);
			break;
		case OutputMode.STREAM:
			var writeStream = outLogStream(outMode);
			writeStream._write = writeFunc;
			break;
		default:
			var writeStream = outLogStream(OutputMode.CONSOLE);
			break;
	}

	readStream.pipe(writeStream);
}

module.exports = { logger }