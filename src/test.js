const { SEOChecker, InputMode, OutputMode } = require('./index.js')

const config = {
    inMode: InputMode.FILE,
    outMode: OutputMode.CONSOLE
}

const seochecker = new SEOChecker(config);

const filePath = './inputtests/test1.html';

seochecker.run(filePath).then((success) => {
    console.log(success);
}).catch((err) => {
    console.log(err);
})


