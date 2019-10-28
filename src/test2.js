const { SEOChecker, InputMode, OutputMode, SEOLogger } = require('./index.js')

const config = {
    inMode: InputMode.FILE,
    filePath: "../inputtests/test2.html"
}
const seochecker = new SEOChecker(config);
const { inLogStream, outLogStream } = SEOLogger;
const runCheckIMG = seochecker.runCheckIMG();
const runCheckHREF = seochecker.runCheckHREF();
const runCheckHeader = seochecker.runCheckHeader();
const runCheckStrongTag = seochecker.runCheckStrongTag(15);
const promises = [
	runCheckIMG, 
	runCheckHREF,
	runCheckHeader,
	seochecker.runCheckStrongTag(15)
]

Promise.all(promises).then((values) => {
	// console.log(values)
	// TODO: only print the defects
	const readStream = inLogStream(values);
	const writeStream = outLogStream(OutputMode.CONSOLE);
	readStream.pipe(writeStream);
}).catch((err) => {
	console.log(err)
})