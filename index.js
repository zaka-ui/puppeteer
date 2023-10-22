const puppeteer = require("puppeteer");

const urlToCheck = "https://example.com";

async function checkGoogleIndex(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const searchUrl = `https://www.google.com/search?q=site:${url}`;
    await page.goto(searchUrl);

    // Wait for the search results to load.
    await page.waitForSelector(".g");

    // Check if the URL appears in the search results.
    const isIndexed = await page.evaluate((url) => {
      const results = Array.from(document.querySelectorAll(".g"));
      return results.some((result) => result.textContent.includes(url));
    }, url);
    console.log("====================================");
    console.log(isIndexed);
    console.log("====================================");
    return isIndexed;
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  } finally {
    await browser.close();
  }
}

checkGoogleIndex(urlToCheck).then((isIndexed) => {
  if (isIndexed) {
    console.log(`${urlToCheck} is indexed in Google.`);
  } else {
    console.log(`${urlToCheck} is not indexed in Google.`);
  }
});
