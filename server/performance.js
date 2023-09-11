import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

function createReportWithBrowser(browser, url, options = { output: "html" }) {
    const endpoint = browser.wsEndpoint();
    const endpointURL = new URL(endpoint);
    return lighthouse(
      url,
      Object.assign({}, {
        port: endpointURL.port
      }, options)
    );
  }
  
function run(){
(async () => {

    const browser = await puppeteer.launch({
        headless : false,
        args: ["--show-paint-rects"]
    });
    
    const result = await createReportWithBrowser(browser,"https://fadyjohn10.github.io/PortfolioWebsite/",{output: "json"});

    console.log('Performance score was', result.lhr.categories.performance.score * 100);

    // fs.writeFileSync("report.html", result.report, "utf-8");
    
    await browser.close();
//   return result;
})();
}
run();