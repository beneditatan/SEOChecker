
# SEOChecker
SEOChecker is a Node.js package to help developers scan a HTML file and show all of the SEO defects.

**Table of Content**
1. [Installation](#installation)
2. [Development](#development)
3. [Documentation](#documentation)
	- [SEOChecker](#seochecker)
	- [logger](#logger)
	- [InputMode](#inputmode)
	- [OutputMode](#outputmode)

# Installation <a name="installation"></a>
To install the module to your local machine:
- run `npm install --save @beneditatan/seochecker`


# Development <a name="development"></a>
To run the module as a development server:
- Clone this repository
- run `npm install` to install dependency

# Documentation <a name="documentation"></a>
## `SEOChecker` class <a name="seochecker"></a>
### Instantiation
*Instantiate SEOChecker with File input:*
```javascript
const { SEOChecker, InputMode } = require('@beneditatan/seochecker');

const config = {
	inMode: InputMode.FILE,
	filePath: "./test2.html"
};

const seochecker = new SEOChecker(config);
```

*Instantiate SEOChecker with Node Readable Stream:*
```javascript
const { SEOChecker, InputMode } = require('beneditatan/seochecker');
const fs = require('fs');

const config = {
	inMode: InputMode.STREAM,
	readableStream: fs.createReadStream('./test2.html') 
}

const seochecker = new SEOChecker(config);
```

### Methods
1.  `runCheckIMG()`
	Detect if any `<img />` tag without **alt** attribute.
	```javascript
	const seochecker = new SEOChecker(config);
	const runCheckIMG = seochecker.runCHECKIMG();
	
	runCheckIMG.then((result) => {
		// do something with the result
		// result = {
		//	data: [
		//	{
		//		defect: true // or false,
		//		logString: 'some string'
		//	}
		//	]
		// }
	}).catch((err) => {
		// do something with the error
	})
	```
2. `runCheckHREF()`
	Detect if any `<a />` tag with **rel** attribute.
	```javascript
	const seochecker = new SEOChecker(config);
	const runCheckHREF = seochecker.runCheckHREF();
	
	runCheckHREF.then((result) => {
		// do something with the result
		// result = {
		//	data: [
		//	{
		//		defect: true // or false,
		//		logString: 'some string'
		//	}
		//	]
		// }
	}).catch((err) => {
		// do something with the error
	})
	```
3.  `runCheckHeader()`
	In `<head>` tag:
	- Detect if header doesn't have `<title>` tag
	- Detect if header doesn't have `<meta name="descriptions" .../>` tag
	- Detect if header doesn't have `<meta name="keywords" .../>` tag

	```javascript
	const seochecker = new SEOChecker(config);
	const runCheckHeader = seochecker.runCheckHeader();
	
	runCheckHeader.then((result) => {
		// do something with the result
		// result = {
		//	data: [
		//	{
		//		defect: true // or false,
		//		logString: 'some string'
		//	},
		//	{
		//		defect: true // or false,
		//		logString: 'some string 2'
		//	},
		//	{
		//		defect: true // or false,
		//		logString: 'some string 3'
		//	}
		//	]
		// }
	}).catch((err) => {
		// do something with the error
	})
	```
4.  `runCheckStrongTag(number)`
	Detect if HTML file has `<strong>` tags more than the specified number.
	
	```javascript
	const seochecker = new SEOChecker(config);
	const runCheckStrongTag = seochecker.runCheckStrongTag(15);
	
	runCheckStrongTag.then((result) => {
		// do something with the result
		// result = {
		//	data: [
		//	{
		//		defect: true // or false,
		//		logString: 'some string'
		//	}
		//	]
		// }
	}).catch((err) => {
		// do something with the error
	})
	```
5. `runCheckH1Tag()`
	Detect if a HTML has more than one `<h1>` tag.

	```javascript
	const seochecker = new SEOChecker(config);
	const  runCheckH1Tag  = seochecker.runCheckH1Tag();
	
	runCheckH1Tag.then((result) => {
		// do something with the result
		// result = {
		//	data: [
		//	{
		//		defect: true // or false,
		//		logString: 'some string'
		//	}
		//	]
		// }
	}).catch((err) => {
		// do something with the error
	})
	```
**Running multiple checking at a time**
You can run more than 1 checking at a time using `Promise.all()`
Example:
```javascript
const  seochecker  =  new  SEOChecker(config);

const  runCheckIMG  = seochecker.runCheckIMG();
const  runCheckHREF  = seochecker.runCheckHREF();
const  runCheckHeader  = seochecker.runCheckHeader();
const  runCheckStrongTag  = seochecker.runCheckStrongTag(15);
const  runCheckH1Tag  = seochecker.runCheckH1Tag();

const promises = [
	runCheckIMG,
	runCheckHREF,
	runCheckHeader,
	runCheckStrongTag,
	runCheckH1Tag
];

Promise.all(promises).then((values) => {
	// log values
}).catch((err) => {
	// handle error
})
```

## `logger` function <a name="logger"></a>
`logger` logs checking result with 3 options:
- Log to console
- Log to file
- Log to Node Writable Stream

And 2 verbosity level:
- verbosity level 0 (default)
	Logs only defects
- verbosity level 1
	Logs both defects and non-defects

1. Log to console
	```javascript
	const { OutputMode, logger } = require('@beneditatan/seochecker');

	Promise.all(promises).then((values) => {
		const logConfig = {
			logArr: values,
			outMode: OutputMode.CONSOLE,
		}
		
		logger(logConfig);
	}).catch((err) => {
		// handle error
	})
	```
2. Log to file
	```javascript
	const { OutputMode, logger } = require('@beneditatan/seochecker');

	Promise.all(promises).then((values) => {
		const logConfig = {
			logArr: values,
			outMode: OutputMode.FILE,
			filePath: './result.txt'
		}
		
		logger(logConfig);
	}).catch((err) => {
		// handle error
	})
	```
3. Log to Node Writable Stream
	```javascript
	const { OutputMode, logger } = require('@beneditatan/seochecker');

	Promise.all(promises).then((values) => {
		const logConfig = {
			logArr: values,
			outMode: OutputMode.STREAM,
			writeFunc: (chunk, encoding, callback) => {
				// do something with stream chunk
				callback();
			}
		}
		
		logger(logConfig);
	}).catch((err) => {
		// handle error
	})
	```

## `InputMode` enum <a name="inputmode"></a>
Provides the enumeration of `SEOChecker` class input mode.

| Member   | Description                     |
| -------- | ------------------------------- |
| FILE     | Input is a file path            |
| STREAM   | Input is a Node Readable Stream |

**Usage**
```javascript
const { InputMode } = require('@beneditatan/seochecker');

const inMode = InputMode.FILE; // or InputMode.STREAM
```

## `OutputMode` enum <a name="outputmode"></a>
Provides the enumeration of `logger` output mode.

| Member | Description |
| -------- | ------------ |
| CONSOLE | Result will be logged to console |
| FILE | Result will be logged to file whose path is specified by user |
| STREAM | Result will be logged to a Node Writable Stream |

**Usage**
```javascript
const { OutputMode } = require(`@beneditatan/seochecker`);

const outMode = OutputMode.CONSOLE;
```
 