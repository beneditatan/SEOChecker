const { SEOChecker, InputMode, OutputMode, logger } = require('./index.js')

const config = {
    inMode: InputMode.FILE,
    filePath: "../inputtests/test2.html"
}
const seochecker = new SEOChecker(config);
// const { inLogStream, outLogStream } = SEOLogger;
const runCheckIMG = seochecker.runCheckIMG();
const runCheckHREF = seochecker.runCheckHREF();
const runCheckHeader = seochecker.runCheckHeader();
const runCheckStrongTag = seochecker.runCheckStrongTag(15);
const runCheckH1Tag = seochecker.runCheckH1Tag();
const promises = [
	runCheckIMG, 
	runCheckHREF,
	runCheckHeader,
	runCheckStrongTag,
	runCheckH1Tag
]

Promise.all(promises).then((values) => {
	const config = {
		logArr: values,
		outMode: OutputMode.STREAM,
		writeFunc: (chunk, encoding, callback) => {
			console.log(chunk.toString());
			callback();
		}
	}
	logger(config);
}).catch((err) => {
	console.log(err)
})