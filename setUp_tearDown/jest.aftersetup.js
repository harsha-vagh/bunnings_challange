const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const width = 1366;
const height = 768;

var screenShotData = false;

jest.setTimeout(90000); //NOTE: Change this if you want to shorten/lengthen the time your tests are allowed to run

if(process.env.NODE_ENV == `prd`){
    jest.retryTimes(0); //NOTE: Remove the if statement if you want to have your tests retry on environments other thatn production.  Change the number to suit how many times you want your tests to retry.
}

async function takeScreenShot(data){
    var title = encodeURIComponent(data.fullTestName.replace(/ /g, "_"));
    var datetime = new Date().toLocaleString().replace(/[^\w\s]/g, '_').replace(/ /g, '');
    var filename = `${datetime}-${title}`;
    console.log('\x1B[31m', '\u2718 RESULT: FAILED ' + "----------------Test:  " + data.testName + "  -----------------", '\x1b[0m');

    console.log('\x1b[36m', 'FAILED AT THIS URL: ' + page.url(), '\x1b[0m');

    console.log('\x1b[35m', filename + '.jpg', '\x1b[0m')
    await page.screenshot({ path: `./errorShots/${filename}.jpg`, fullPage: true });
}

beforeAll(async() => {
        let failEvent = global.failEvent;

        failEvent.on('testFailedScreenShot', async (data) => {
            screenShotData = data
        });
    })
    
    //setUp
beforeEach(async() => {
    screenShotData = false;

    var configs = {
        HEADLESS: {
            defaultViewport: { width: width, height: height },
            headless: true,
        },
        MOBI: {
            defaultViewport: null
        }
    }
    global.browser = await puppeteer.launch(Object.assign({
            headless: false,
            devtools: false,
            ignoreHTTPSErrors: true,
            args: [
                '--start-maximized',
                '--disable-infobars',
                '--disable-dev-shm-usage',
                '--no-first-run',
                '--no-zygote',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--proxy-server="direct://"',
                '--proxy-bypass-list=*'
            ],
            defaultViewport: null
        },
        (process.env.HEADLESS) ? configs.HEADLESS : {},
        (process.env.MOBI) ? configs.MOBI : {}));


    global.page = await browser.newPage();

    if (process.env.MOBI)
        await page.emulate(devices['iPhone 6']);

    await page.setDefaultNavigationTimeout(20000);
    // await page.setRequestInterception(true); //allows us to change request headers


});

afterEach(async() => {
    if(screenShotData){
        await takeScreenShot(screenShotData);
    }
    await browser.close();
})