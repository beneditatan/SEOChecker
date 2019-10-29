const { inLogStream, outLogStream } = require('../logic/LogStream');
const OutputMode = require('../core/enums/OutputModeEnum');

const getLogStrings = (logArr, verbosity) => {
	// verbosity == 0 => only defects
	// verbosity == 1 => all checking results (both defect == true and defect == false)
	
	// console.log(logArr)
	let logStrings = [];

	if (Array.isArray(logArr))
	// is an array
	{
		// console.log("Its an array")
		for(var i = 0; i < logArr.length; i++)
		{
			for(var j = 0; j < logArr[i].data.length; j++)
			{
				// console.log(logArr[i].data[j])
				const verbosityCheck = verbosity == 0 ? logArr[i].data[j].defect : true;
				if (verbosityCheck)
				{
					const string = logArr[i].data[j].logString;
					// console.log(string)
					logStrings.push(string)
				}
			}
		}
	}
	else 
	{
		for(var j = 0; j < logArr[i].data.length; j++)
			{
				const verbosityCheck = verbosity == 0 ? logArr.data[j].defect : true;
				if (verbosityCheck)
				{
					logStrings.push(logArr[i].data[j].logString)
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