import puppeteer from "puppeteer";
import _ from "lodash";
import { LOGIN_URL, SELECTORS, BASE_URL } from "./helper";
import { getInfo } from "./crawlerInfo";
import moment from "moment";

const width = 1024;
const height = 1600;
const headless = false;

const selectedYear = "2020";
// atualizar a data tbm no arquivo crawlerInfo.js

const login = "LOGIN";
const password = "SENHA";

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: width, height: height },
    headless,
  });

  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  await page.type(SELECTORS.LOGIN_FIELD, login);
  await page.type(SELECTORS.PASSWORD_FIELD, password);
  await page.click(SELECTORS.LOGIN_BUTTON);
  await page.waitForNavigation();

  await page.goto(BASE_URL);

  const rawAgents = await page.$$eval(SELECTORS.AGENT_SELECT_SELECTOR, (all) =>
    all.map((a) => a.value)
  );

  const agents = rawAgents.filter((agent) => agent != -1);

  let results = [];

  await page.close();

  for (const agent of agents) {
    const result = await getInfo(browser, agent);
    results = [...results, result];
  }

  const mappedValues = _.chain(results)
    .flatten()
    .map((value) => {
      return {
        date: value["Data do Negócio"],
        op: value["Compra/Venda"],
        id: value["Código Negociação"],
        quantity: Number(value["Quantidade"]),
        price: Number(value["Preço (R$)"].replace(",", ".")),
        totalPrice: Number(value["Valor Total(R$)"].replace(",", ".")),
      };
    })
    .groupBy("id")
    .value();

  const groupedByYear = Object.entries(mappedValues).map((entry) => {
    const [key, value] = entry;
    return {
      key,
      values: _.groupBy(value, (item) => {
        const year = moment(item.date, "DD/MM/YYYY").year();
        return year == selectedYear ? "actual-year" : "last-years";
      }),
    };
  });

  const finalResults = groupedByYear.map(({ key, values }) => {
    const actualYear = _.reduce(
      values["actual-year"].filter((item) => item.op == "C"),
      (agg, item) => {
        return {
          ...agg,
          quantity: agg.quantity + item.quantity,
          price: (agg.price + item.price) / 2,
          totalPrice: agg.totalPrice + item.totalPrice,
        };
      }
    );

    const lastYearsValues = values["last-years"] || [];

    const totalLastYears =
      lastYearsValues.length == 1
        ? lastYearsValues[0].totalPrice
        : _.reduce(
            lastYearsValues.filter((item) => item.op == "C"),
            (agg, item) => agg.totalPrice + item.totalPrice
          );

    return {
      key,
      actualYear,
      lastYears: totalLastYears,
    };
  });

  console.log(finalResults);

  // get CNPJ
  // format to imposto de renda

  await browser.close();
})();
