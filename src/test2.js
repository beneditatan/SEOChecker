const { SEOChecker, InputMode, OutputMode, SEOLogger } = require('./index.js')

const config = {
    inMode: InputMode.FILE,
    filePath: "../inputtests/test2.html"
}
const seochecker = new SEOChecker(config);
const { inLogStream, outLogStream } = SEOLogger;
// const runCheckIMG = seochecker.runCheckIMG;

Promise.all([seochecker.runCheckIMG()]).then((values) => {
	// console.log(values)
	const readStream = inLogStream(values);
	const writeStream = outLogStream(OutputMode.CONSOLE);
	readStream.pipe(writeStream);
}).catch((err) => {
	console.log(err)
})