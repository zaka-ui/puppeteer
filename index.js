const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");

const urlToCheck = "https://ng-menuiserie.fr/";
const sitemapUrl = "https://ng-menuiserie.fr/page-sitemap.xml"; // Replace with the correct sitemap URL

async function getGoogleSearchLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const links = [];
    const maxScrolls = 5; // Change this to control the number of scrolls you want to perform

    for (let scrollCount = 0; scrollCount < maxScrolls; scrollCount++) {
      const searchUrl = `https://www.google.com/search?q=site:${url}&start=${
        scrollCount * 10
      }`;
      await page.goto(searchUrl, { waitUntil: "networkidle2" });

      // Wait for a short time to allow results to load with infinite scroll.
      await page.waitForTimeout(1000);

      // Extract links from the current page.
      const pageLinks = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(".tF2Cxc"));
        return results.map((result) => result.querySelector("a").href);
      });

      links.push(...pageLinks);
    }

    return links;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  } finally {
    await browser.close();
  }
}

async function extractLinksFromSitemap(sitemapUrl) {
  try {
    const { data } = await axios.get(sitemapUrl);
    const $ = cheerio.load(data, { xmlMode: true });

    const links = [];
    $("url").each((index, element) => {
      const loc = $(element).find("loc").text();
      links.push(loc);
    });

    return links;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

async function checkIndexStatus(url, sitemapLinks, searchLinks) {
  const indexedLinks = [];
  const nonIndexedLinks = [];

  for (const link of searchLinks) {
    const isIndexed = sitemapLinks.includes(link);
    if (isIndexed) {
      indexedLinks.push(link);
    } else {
      nonIndexedLinks.push(link);
    }
  }

  return { indexedLinks, nonIndexedLinks };
}

(async () => {
  const sitemapLinks = await extractLinksFromSitemap(sitemapUrl);
  const searchLinks = await getGoogleSearchLinks(urlToCheck);

  const { indexedLinks, nonIndexedLinks } = await checkIndexStatus(
    urlToCheck,
    sitemapLinks,
    searchLinks
  );

  console.log("Indexed Links:");
  indexedLinks.forEach((link, index) => console.log(`[${index}] ${link}`));

  console.log("\nNon-Indexed Links:");
  nonIndexedLinks.forEach((link, index) => console.log(`[${index}] ${link}`));
})();
