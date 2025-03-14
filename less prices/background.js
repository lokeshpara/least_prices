// List of supported price comparison websites
const COMPARISON_SITES = [
  {
    name: 'Walmart',
    searchUrl: 'https://www.walmart.com/search?q=',
    priceSelector: '.price-main .price-group'
  },
  {
    name: 'Target',
    searchUrl: 'https://www.target.com/s?searchTerm=',
    priceSelector: '.styles__StyledPricePromoWrapper-sc-1n0fd6l-0'
  },
  {
    name: 'Best Buy',
    searchUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st=',
    priceSelector: '.priceView-customer-price span'
  }
];

async function searchProductPrices(productInfo) {
  const results = [];
  
  for (const site of COMPARISON_SITES) {
    try {
      const response = await fetch(site.searchUrl + encodeURIComponent(productInfo.title));
      // Note: In a real extension, you would need to handle CORS and implement proper
      // web scraping. This is a simplified version for demonstration.
      
      results.push({
        store: site.name,
        url: response.url,
        // In reality, you would parse the HTML and extract the actual price
        price: 'Price data would be extracted here'
      });
    } catch (error) {
      console.error(`Error searching ${site.name}:`, error);
    }
  }
  
  return results;
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchPrices') {
    searchProductPrices(request.productInfo)
      .then(results => {
        sendResponse({ success: true, results });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
}); 