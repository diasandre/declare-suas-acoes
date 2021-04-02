import { BASE_URL, SELECTORS } from "./constants";
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

export const getCNPJInfo = async (browser, id) => {
  const CNPJ_SEARCH_URL = `http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/BuscaEmpresaListada.aspx?Nome=${id}&idioma=pt-br`;

  const newPage = await browser.newPage();
  await newPage.goto(CNPJ_SEARCH_URL);

  const cvm = await newPage.evaluate(() =>
    document
      .querySelector(
        "table#ctl00_contentPlaceHolderConteudo_BuscaNomeEmpresa1_grdEmpresa_ctl01 td a"
      )
      .getAttribute("href")
      .replace("ResumoEmpresaPrincipal.aspx?codigoCvm=", "")
  );

  const CNPJ_URL = `http://bvmf.bmfbovespa.com.br/pt-br/mercados/acoes/empresas/ExecutaAcaoConsultaInfoEmp.asp?CodCVM=${cvm}`;

  await newPage.goto(CNPJ_URL);

  const cnpj = await newPage.evaluate(
    () =>
      document.querySelector(
        "div#accordionDados table tbody tr:nth-child(3) td:nth-child(2)"
      ).textContent
  );

  await newPage.close();

  return cnpj;
};
