// const { SEOChecker, InputMode, OutputMode } = require('./index.js')

// const config = {
//     inMode: InputMode.FILE,
//     outMode: OutputMode.CONSOLE
// }

// const seochecker = new SEOChecker(config);

// const filePath = './inputtests/test1.html';

// seochecker.run(filePath).then((success) => {
//     console.log(success);
// }).catch((err) => {
//     console.log(err);
// })

const { Transform, Writable, Readable } = require('stream');
const fs = require('fs');
const NodeHTMLParser = require('node-html-parser')
let invalidHREF = 0;
let invalidImages = 0;
let noOfChunk = 0;

const checkTagCompleteness = (node, attr, attrVal = '') => {
	let valid = false;
	var attrObj = node.attributes;

	if (attr in attrObj)
	{
		if (attrVal === '')
		{
			valid = true;
		}
		else 
		{
			valid = attrVal == attrObj[attr] ? true : false;
		}
	} 
	else 
	{
		valid = false;
	}

	return valid;
}

const checkTagExist = (root, tag) => {
	const nodes = root.querySelectorAll(tag);

	return nodes

}

const checkNumberOfTag = (root, tag) => {
	const nodes = root.querySelectorAll(tag);

	return nodes.length;
}

const checkIMG = () => {
	return new Transform({
		transform(chunk, encoding, callback) {
			var root = NodeHTMLParser.parse(chunk.toString())
			var images = checkTagExist(root, 'img');
			for (var i = 0; i < images.length; i++)
			{
				var valid = checkTagCompleteness(images[i], 'alt')
				invalidImages = valid ? invalidImages : invalidImages + 1;
			}
		
			callback(null, chunk);
		}
	});
}

const checkHREF = () => {
	return new Transform({
		transform(chunk, encoding, callback) {
			var root = NodeHTMLParser.parse(chunk.toString())
			var hrefs = checkTagExist(root, 'a')

			for (var i = 0; i < hrefs.length; i++)
			{
				var valid = checkTagCompleteness(hrefs[i], 'rel');
				invalidHREF = valid ? invalidHREF : invalidHREF + 1;
			}
			
			callback(null, chunk);
		}
	});
}

const checkHeader = () => {
	return new Transform({
		transform(chunk, encoding, callback) {
			const root = NodeHTMLParser.parse(chunk.toString());
			const header = checkTagExist(root, 'head');
			if (header){
				const title = checkTagExist(header, 'title');
				const desc = checkTagCompleteness(header, 'meta', 'name', attrVal = 'descriptions')
				const keyword = checkTagCompleteness(header, 'meta', 'name', attrVal = 'keywords')
			}

		}
	})
}

const outStream = () => {
	return new Writable({
		write(chunk, encoding, callback){
			// console.log(`Processing chunk ${noOfChunk++}`);
			callback();
		}
	})
}

const logInStream = () => {
	return new Readable({
		read() {}
	})
}

// const logInStream = new Readable({
// 	read() {}
// })

const logOutStream = (writeFunc) => {
	return new Writable({
		write(chunk, encoding, callback){
			writeFunc(chunk);
			callback();
		}
	})
}

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

const inStream = fs.createReadStream("../inputtests/test2.html");

const runCheckIMG = () => {

	return new Promise((resolve, reject) => {
		try 
		{
			inStream.pipe(checkIMG())
						.pipe(outStream())
						.on('finish', () => {
							const string = `Invalid images: ${invalidImages}\n`;
							const inLogger = logInStream();
							inLogger.push(string)
							inLogger.push(null);
							logger(inLogger, 0, string);
						})

			// log
			resolve(true)
		}
		catch (err)
		{
			reject(err)
		}
		
	})
}

const runCheckHREF = async () => {

	return new Promise((resolve, reject) => {
		try 
		{
			inStream.pipe(checkHREF())
						.pipe(outStream())
						.on('finish', () => {
							const string = `Invalid href tag: ${invalidHREF}\n`;
							const inLogger = logInStream();
							inLogger.push(string)
							inLogger.push(null);
							logger(inLogger, 0, string);
						})

			// log
			resolve(true)
		}
		catch (err)
		{
			reject(err)
		}
		
	})
}


/**
 * CLIENT
 */
Promise.all([runCheckIMG(), runCheckHREF()]).then((values) => {
	console.log(values)
}).catch((err) => {
	console.log(err)
})

