const readline = require("readline");
const { connect } = require("puppeteer-real-browser");

function parseProxyURL(proxyUrl) {
  try {
    const urlObj = new URL(proxyUrl);
    const proxyConfig = {
      host: urlObj.hostname,
      port: parseInt(urlObj.port, 10)
    };
    if (urlObj.username) {
      proxyConfig.username = urlObj.username;
    }
    if (urlObj.password) {
      proxyConfig.password = urlObj.password;
    }
    return proxyConfig;
  } catch (error) {
    console.error("Failed to parse proxy URL:", error.message);
    return null;
  }
}

async function grass(proxyConfig) {
  try {
    const { browser, page } = await connect({
      headless: false,
      args: [],
      customConfig: {},
      turnstile: false,
      fingerprint: true,
      connectOption: {
        defaultViewport: null,
      },
      disableXvfb: false,
      ignoreAllFlags: false,
      proxy: proxyConfig,
    });

    const response = await page.goto("https://app.getgrass.io/");
  } catch (error) {
    console.error("Error during browser operation:", error.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter proxy URL: ", async (inputProxy) => {
  const proxyConfig = parseProxyURL(inputProxy.trim());
  if (!proxyConfig) {
    console.error("Invalid proxy format. Exiting.");
    rl.close();
    return;
  }

  await grass(proxyConfig);
  rl.close();
});
