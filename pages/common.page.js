const request = require('request');

class common {
	/**
     * click on something using XPATH
     * @param {string} selector XPath of what you want to get, including the text to be used.  Would generally be used with a "contained" in the xpath.
     */
	async clickWithXPath(selector) {
		let target = await page.$x(selector);
		target[0].click();
	}

	//verify element exists
	async verifyElementExists(button_selector) {
		const exists = (await page.$$(button_selector)).length;
		//console.log("Count is "+exists);
		return exists;
	}
	/**
     * Gets the text that is within an element.  Will trim out white spaces on either side of the text.
     * @param {string} selector CSS selector or xpath or object of what you want to get the inner text of.
     */
	async getInnerText(selector) {
		let element;

		if (typeof selector == 'object') {
			element = selector;
		} else if (selector.indexOf('//') == 0) {
			await page.waitForXPath(selector, { visible: true, timeout: 5000 });
			let xPathElements = await page.$x(selector);
			element = xPathElements[0];
		} else {
			await page.waitForSelector(selector, { visible: true, timeout: 5000 });
			element = await page.$(`${selector}`);
		}

		let text = await element.getProperty('innerText');
		let innerText = await text.jsonValue();
		return innerText.trim();
	}

	/**
     * Gets the value of an attribute of an element.  For example, you can get the id, class, or value from a div tag.  Returns a string of that attribute.
     * @param {string} selector CSS selector of the element you want to get the attribute from.
     * @param {string} attribute the attribute you want to get the string value of.
     */
	async getAttribute(selector, attribute) {
		await page.waitForSelector(selector, { timeout: 10000 });
		return await page.$eval(selector, (element, attribute) => element.getAttribute(attribute), attribute);
	}

	/**
     * Used when clicking on something that also navigates the page.  Uses default timeout for navigating
     * 
     * @param {string} selector The selector (css, xpath, element) of what you want to click.
     * @param {string} navigationType How you want the timeout to work for navigation.  Default is "load".  networkidle0 and networkidle2 are other commonly used navigation types.
     */
	async clickNavigation(selector, navigationType = 'load') {
		try {
			await this.click(selector);
			// await page.waitFor(5);
			await page.waitForNavigation({ waitUntil: `${navigationType}` });
		} catch (e) {
			//do nothing
		}
	}

	async expectElementOnScreen(selector, hidden = false) {
		let visibility = {
			visible: true,
			hidden: false
		};
		if (hidden) {
			visibility.visible = false;
			visibility.hidden = true;
		}

		if (selector.indexOf('//') == 0) {
			//case of xpath
			await page.waitForXPath(selector, {
				visible: visibility.visible,
				hidden: visibility.hidden,
				timeout: 10000
			});
		} else {
			//case for CSS selector
			await page.waitForSelector(selector, {
				visible: visibility.visible,
				hidden: visibility.hidden,
				timeout: 10000
			});
		}
	}

	/**
     * A more safer version of navigating to a different page.  This should be used as there may be some pages that take a really long time to load, but you don't want that to ruin your tests by having it wait forever for the page to load.
     * 
     * @param {string} url The url you would like to navigate to.
     */
	async navigate(url) {
		try {
			console.log(`navigating to: ${url}`);
			await page.goto(url, { waitUntil: 'load' });
		} catch (e) {
			//do nothing
		}
		await page.waitFor(1000); //NOTE add in 1 second wait after navigating, incase there is something that happens (such as the populating of input fields that happens a slight moment after loading up the page).
	}

	/**
     * Returns a new page/tab that opens up after clicking on something.  Assign the function to a variable, so that the variable will equal to the new page that opens up.
     * 
     * @param {string} selector The CSS selector of what you want to click on
     * 
     * @returns {object} The new page that opens up after clicking.  Can be a tab, or a new window.
     */
	async clickGetNewPage(selector) {
		let newPage;
		browser.on('targetcreated', async function(target) {
			newPage = await target.page();
		});
		await this.click(selector);
		await page.waitFor(5000);
		try {
			await newPage.waitForNavigation({ waitUntil: 'load', timeout: 4000 });
		} catch (error) {
			//do nothing
		}
		return newPage;
	}

	/**
     * Click on an object, whether you use an elementHandle, xpath, css selector
     * 
     * @param {string} selector Either the elementHandle, css selector, or the XPath 
     */
	async click(selector) {
		if (typeof selector == 'object') {
			await selector.click();
		} else if (selector.indexOf('//') == 0) {
			//xpath click
			await page.waitForXPath(selector, { visible: true });
			let clickTarget = await page.$x(selector);
			await clickTarget[0].click();
		} else {
			//css selector click (or just .$)
			await page.waitForSelector(selector, { visible: true });
			let clickTarget = await page.$(selector);
			await clickTarget.click();
		}

		await page.waitFor(200);
	}

	/**
     * Enter text into a field.  Also comes built in with a check to see if the selector, whether it is css or xpath, is visible on the page (so that it will actually type into the thing).
     * 
     * @param {string} selector The css or xpath selector for the element you want to type into.
     * @param {string} input The text that you want to type into the element.
     */
	async type(selector, input) {
		let element;

		if (selector.indexOf('//') == 0) {
			//xpath click
			await page.waitForXPath(selector, { visible: true });
			let xPathElements = await page.$x(selector);
			element = xPathElements[0];
		} else {
			//css selector click (or just .$)
			await page.waitForSelector(selector, { visible: true });
			element = await page.$(selector);
		}
		await element.type(input);
		await page.waitFor(350);
	}

	/**
     * Same as the basic page.url(), but returns the decoded version.
     * 
     * @returns {string} The url that the page is currently on, but decoded.
     */
	getUrl() {
		let url = page.url();
		return decodeURI(url);
	}

}

module.exports = new common();
