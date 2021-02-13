const NodeEnvironment = require(`jest-environment-node`);
const request = require('request');
const EventEmitter = require('events');

class CustomEnvironment extends NodeEnvironment {

    constructor(config) {
        super(config);
    }

    async setup() {
        await super.setup();
        this.global.failEvent = new EventEmitter();
    }

    async teardown() {
        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }

    async handleTestEvent(event, state) {
        
        if (event.name == `test_fn_failure`) {

            var data = {
                testName: event.test.name,
                mainTestName: event.test.parent.name,
                errorMessage: event.test.errors[0][0],
                fullTestName: `${event.test.parent.name}  ${event.test.name}`,
            }

            console.log('\x1B[33m', `Woops, there was a failure with the following error:
            
${data.errorMessage}`, '\x1b[0m');


            let failEvent = this.global.failEvent;
            failEvent.emit(`testFailedScreenShot`, data);


            // if (process.env.NODE_ENV == `prd`) {
            //     notificationId = NOTIFICATION_ID;
            // }
            
            // this.makeRequest(`[${process.env.NODE_ENV}] The test *${data.mainTestName}* has failed at _${data.testName}_
            // \`\`\` ${data.errorMessage}\`\`\``);
        }
    }


    makeRequest(message) {

        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        }
        request.post({
               
                headers: headers,
                json: {
                    text: `${message}`
                }
            },
            (error, res, body) => {});
    }
}
module.exports = CustomEnvironment;