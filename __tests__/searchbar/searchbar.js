const common = require(`../../pages/common.page`);
const config = require(`../../config.data.${process.env.NODE_ENV}`);

describe('Bunnings Searchbar Tests', function() {
	beforeEach(async function() {
		await common.navigate(config.urls.bunningsUI.homePageUrl);
        await page.waitFor(3000);
	});

	test('Search bar is visible on the home page', async function() {
		//SECTION: Verify the search bar is visible on the page
		await common.expectElementOnScreen('//div[@class="search-container"]');
		//!SECTION
	});

	test(`Autosuggestion while typing in the search bar`, async function() {
		//SECTION: Verify the search bar is visible on the page
		await common.expectElementOnScreen('//div[@class="search-container"]');
		//!SECTION

		//SECTION: Start typing 'door' in the seach bar
		await common.click(`//div[@class="search-container_container"]`);
		await page.waitFor(2000);
        await common.type("//div[@class='search-container_container']", "door");
		await page.waitFor(3000);
        //!SECTION

		//SECTION: Verify the autosuggestion dropdown appears
        await common.expectElementOnScreen(`//*[@id="ui-id-1"]`);
        await page.waitFor(3000);
        //!SECTION

        //SECTION: Verify the dropdown shows 'door window'
        await common.expectElementOnScreen(`//*[not(contains(@style,'display:none'))]/li/a[@href='/search/products?q=door%20window']`);
        //!SECTION
	});
	

	test('Search results displayed should be relevant to search keyword', async function() {
		//SECTION: Start typing 'door' in the seach bar
		await common.click(`//div[@class="search-container_container"]`);
		await page.waitFor(2000);
        await common.type("//div[@class='search-container_container']", "door");
		await page.waitFor(2000);
        //!SECTION

        //SECTION: Verify the autosuggestion dropdown appears
        await common.expectElementOnScreen(`//*[@id="ui-id-1"]`);
        //!SECTION

        //SECTION: Verify the dropdown shows 'door window'
        await page.waitFor(2000);
        await common.expectElementOnScreen(`//*[not(contains(@style,'display:none'))]/li/a[@href='/search/products?q=door%20window']`);
        await page.waitFor(2000);  
        //!SECTION
        
        //SECTION: Verify search result has the test 'door window'
        await common.click(`//*[not(contains(@style,'display:none'))]/li/a[@href='/search/products?q=door%20window']`);
        await page.waitFor(2000);            
        let searchResultText = await common.getInnerText(`//h1/span[@class='responsive-search-title__search-term']`);
        console.log('Search result text contains :', searchResultText);
        await common.expectElementOnScreen(`//h1/span[contains(.,'door window')]`);
        //!SECTION
    });
		
	test('URL for redirecting listing page should have the search text included', async function() {
   	    //SECTION: Start typing 'door' in the seach bar
		await common.click(`//div[@class="search-container_container"]`);
		await page.waitFor(3000);
        await common.type("//div[@class='search-container_container']", "door");
		await page.waitFor(3000);
        //!SECTION

        //SECTION: Verify the autosuggestion dropdown appears
        await common.expectElementOnScreen(`//*[@id="ui-id-1"]`);
        //!SECTION

        //SECTION: Verify the dropdown shows 'door window'
        await page.waitFor(2000);
        await common.expectElementOnScreen(`//*[not(contains(@style,'display:none'))]/li/a[@href='/search/products?q=door%20window']`);
        await page.waitFor(2000);  
        //!SECTION

		//SECTION: Making sure the page is rediriecting to correct search result page
        await page.waitFor(3000);            
        await common.click(`//*[not(contains(@style,'display:none'))]/li/a[@href='/search/products?q=door%20window']`);
        await page.waitFor(2000);
		let url = common.getUrl();
		console.log('URL is: ', url);
		expect(url).toContain(`door window`);
		//!SECTION
	});
	
});
