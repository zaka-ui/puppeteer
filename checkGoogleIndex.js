const axios = require("axios");
const cheerio = require("cheerio");

async function isUrlIndexedInGoogle(urlToCheck) {
  try {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    ];
    const headers = {
      "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
    };
    // Make a Google search query with your URL
    const googleSearchUrl = `https://www.google.com/search?q=site%3A${encodeURIComponent(
      urlToCheck
    )}`;
    //   console.log(googleSearchUrl)
    const response = await axios.get(googleSearchUrl, { headers });

    // Load the response HTML into Cheerio
    const $ = cheerio.load(response.data);

    // Check if the URL is present in the search results
    const searchResultsCount = $("h3").length;
    //   console.log(searchResultsCount)
    if (searchResultsCount > 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:" + error);
    return false;
  }
}

module.exports = isUrlIndexedInGoogle;
