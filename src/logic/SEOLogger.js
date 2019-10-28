const logger = (inLogger, outMode, filePath = '', writeFunc = (chunk) => {}) => {
	console.log("called")
	inLogger.pipe(process.stdout)

	switch(outMode)
	{
		case 0:
			// console
			inLogger.pipe(process.stdout)
			break;
		default:
			inLogger.pipe(process.stdout)
			break;

	}
}

module.exports = { logger };