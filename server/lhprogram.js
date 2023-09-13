import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

export async function runProgram(url){
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', port: chrome.port};
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  return runnerResult.lhr;
}

// `.lhr` is the Lighthouse Result as a JS object
// console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
// console.log('SEO score was', runnerResult.lhr.categories.seo.score * 100);
// console.log('BEST PR score was', runnerResult.lhr.categories['best-practices'].score * 100);
// console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);
// console.log('Accessibility score was', runnerResult.lhr.categories);

// console.log(reportHtml);

