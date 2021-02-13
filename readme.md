# New Puppeteer Template
This template is a new version of what was available in 2019.  A lot of the things that were available before are still available here, but configurations have been changed to allow for more customisation of how your tests run.

## Setup

1. Clone this repository.
2. Open up the workspace in visual studio code.
3. Open up the terminal in the workspace and enter the command: `npm install`


## Writing Tests
When writing tests, place all files into `__tests__` folder.  You may use subfolders if you would like.  Each test file should end with `.js`, as tests are written in javascript.

Generally, you will want to import the common file under pages, and the config modules. It will look something like this:

```
const common = require(`../pages/common.page`);
const config = requrie(`../config.data.${process.env.NODE_ENV}`);
```
Please keep in mind that the path may be different if your test is found in a subfolder.


## Running Tests

Depending on how you want to run your tests, you can use the following commands, which are specified in `package.json`

```
npm run-script stg -- <filename>
npm run-script stg-headless -- <filename>
npm run-script prd -- <filename>
npm run-script prd-headless -- <filename>
```
In this example, please enter following into your terminal
```
npm run-script prd searchbar.js
```

# The common functions
There is a pages file called common, which has rewritten a lot of the puppeteer methods into easier to use methods.  The following if a list of notable methods:

```
async click(selector) - a click function that allows you to use either a css selector, xpath, or an element to click.

async clickNavigation(selector, navigationType = "load") - the same as the previously mentioned click function, but to be used when you know there will be a page change after clicking.

async navigate(url) - upgraded navigation method.  There are times when the page loads, but puppeteer thinks it's not ready yet, which will ultimately end up in a timeout.  This ignores the timeout, and assumes that the page has loaded correctly after the timeout, allowing tests to continue.

async type(selector, text) - allows you to use a css selctor, xpath, or element as the selector.  It will type in the text into what you have selected.

async getInnerText(selector) - allows you to use css selector, xpath, or element to get the text that is written in the object.  Useful for making assertions.
```

### jest.config.js
This is the central config file.  Used to add in big settings for the context of the test runner.  In this project, we set the testenvironment, and after environment setup.  It is common to specify the setup file here as well.

### jest.setup.js
This is the first setup file that gets run.  

### CustomEnvironment.js
The custom environment is used to specify how your test runner will behave.  You can refer to [here](https://jestjs.io/docs/en/configuration), and scroll down to `testEnvironment` for an example on how to write the script.  You first start by creating a class that extends `NodeEnvironment`.   In the class, you will need a constructor, and 3 compulsory methods:
```
async setup()
async teardown()
runscript(script)
```

**IMPORTANT!!!!**
Keep in mind that the custom environment does not have access to puppeteer's browser/page in this class.

#### async setup()
This is run at the start of the test environment.  You will want to inherit before you add in your own custom setup code.  

You will generally set global variables here using `this.global.<variableName>`

#### async teardown()
This is run at the end of the test environment.  You will want to inherit AFTER you add in your own custom code.  You will generally want to to unset any global variables that were set during setup.

#### runScript(script)
This gets called when a script gets called during the test.  This actually gets called many times through out the running of a test suite.  

Highly advised not to touch unless you know what you're doing!

#### handleTestEvent(event, state)
This is a method that is NOT compulsory.  This is a method that is allowed from jest-circus, which will fire off when an event happens (such as when the test starts, finishes, fails, etc...).

This project makes use of this method to check when the test fails.  It checks whether the event is a failed event, in which case, it will then use an event listener to emit a message to a listener in a file that can make use of browser/page to take screenshots.  This project also makes use of an api post request that sends a message to a slack webhook for notifications to work.

### jest.aftersetup.js
This is used for configs that get run after the setup has run, and the custom environment has started up.

