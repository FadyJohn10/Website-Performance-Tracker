const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const argv = require('yargs').argv;
const url = require('url');
const fs = require('fs');

const launchChromeAndRunLighthouse = url => {

    return chromeLauncher.launch().then(chrome => {
        const opts = {
            port: chrome.port,
            output: 'html'
        };
    
    return lighthouse(url, opts).then(results => {
        return chrome.kill().then(() => {
          return {
            js: results.lhr,
            html: results.report,
          };
        });
      });

  });
};

if (argv.url) {
    const urlObj = new URL(argv.url);
    let dirName = urlObj.host.replace("www.", "");

    if (urlObj.pathname !== "/") {
        dirName = dirName + urlObj.pathname.replace(/\//g, "_");
    }
    if (!fs.existsSync("reports")) {
        fs.mkdirSync("reports");
    }
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(`reports/${dirName}`);
    }

    launchChromeAndRunLighthouse(argv.url).then(results => {
        fs.writeFile(`reports/${dirName}/${results.js["fetchTime"].replace(/:/g, "_")}.html`,
            results.html,
            err => {
              if (err) throw err;
            }
          );
    });
    

} else {
    throw "You haven't passed a URL to Lighthouse";
}