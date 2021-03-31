const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://ceiapp.b3.com.br/CEI_Responsivo/login.aspx')
  const title = await page.title()
  console.log(title)
  await browser.close()
})()
