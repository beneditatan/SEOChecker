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

/**
 * LOGGER
 */

 
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
		case 0:
			// console
			return process.stdout;
		case 1:
			// file
			return fs.createWriteStream(filePath)
		case 2:
			// writable stream
			return new Writable({});
		default:
			return process.stdout;
	}
}


/**
 * PRESENTATION LAYER
 */
const inStream = fs.createReadStream("../inputtests/test2.html");

const runCheckIMG = () => {

	return new Promise((resolve, reject) => {
		try 
		{
			inStream.pipe(checkIMG())
						.pipe(outStream())
						.on('finish', () => {
							const string = `Invalid images: ${invalidImages}\n`;
							resolve(string)
						})
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
							resolve(string)
						})

			// log
			
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
	const readStream = inLogStream(values);
	const foo = (chunk, encode, callback) => {
		console.log(chunk.toString());
		callback();
	}
	const writeStream = outLogStream(2);
	writeStream._write = foo;
	readStream.pipe(writeStream);
}).catch((err) => {
	console.log(err)
})

