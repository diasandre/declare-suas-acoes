import { BASE_URL, SELECTORS } from "./helper";
import HtmlTableToJson from "html-table-to-json";

export const getInfo = async (browser, agent) => {
  const newPage = await browser.newPage();
  await newPage.goto(BASE_URL);

  await newPage.select(SELECTORS.AGENT_SELECT, agent);

  await newPage.$eval(SELECTORS.END_DATE, (el) => (el.value = "31/12/2020"));

  await newPage.click(SELECTORS.SEARCH_BUTTON);

  await newPage.waitForSelector(SELECTORS.RESULT_DIV_ID);

  const data = await newPage.evaluate(
    () =>
      document.querySelector(
        "#ctl00_ContentPlaceHolder1_rptAgenteBolsa_ctl00_rptContaBolsa_ctl00_pnAtivosNegociados table" //SELECTORS dont exist inside evalute
      ).outerHTML
  );

  const parsedData = HtmlTableToJson.parse(data);

  const [result] = parsedData.results;

  await newPage.close();

  result.pop(); // remove tfooter from table

  return result;
};
