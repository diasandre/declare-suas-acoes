import puppeteer from "puppeteer";
import _ from "lodash";
import moment from "moment";

import {
  LOGIN_URL,
  SELECTORS,
  BASE_URL,
  VALUES,
  DATE_FORMAT,
  ACTUAL_YEAR,
  LAST_YEARS,
} from "./constants";

import { getCNPJInfo, getInfo } from "./crawler";
import {
  formatPrice,
  normalizeObject,
  normalizeObjectWhenBuy,
  normalizeObjectWhenSell,
} from "./helper";

const width = 1024;
const height = 1600;
const headless = true;

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

  let crawlerResults = [];

  await page.close();

  for (const agent of agents) {
    const result = await getInfo(browser, agent);
    crawlerResults = [...crawlerResults, result];
  }

  const flatMapAndGroupById = _.chain(crawlerResults)
    .flatten()
    .map((value) => {
      return {
        date: value[VALUES.DATE],
        op: value[VALUES.OP],
        id: value[VALUES.ID],
        quantity: Number(value[VALUES.QUANTITY]),
        price: formatPrice(value[VALUES.PRICE]),
        totalPrice: Number(formatPrice(value[VALUES.TOTAL_PRICE])),
      };
    })
    .groupBy("id")
    .value();

  const groupedByYear = Object.entries(flatMapAndGroupById).map(
    ([key, value]) => {
      return {
        key,
        values: _.groupBy(value, (item) => {
          const year = moment(item.date, DATE_FORMAT).year();
          return year == selectedYear ? ACTUAL_YEAR : LAST_YEARS;
        }),
      };
    }
  );

  const aggregatedValues = groupedByYear.map(({ key, values }) => {
    const lastYearsValues = values[LAST_YEARS] || [];

    const hasOnlyOneValueLastYear = lastYearsValues.length == 1;

    const lastYears = hasOnlyOneValueLastYear
      ? normalizeObject(lastYearsValues[0])
      : _.reduce(lastYearsValues, (agg, item) => {
          if (item.op == "C") {
            return normalizeObjectWhenBuy(agg, item);
          } else {
            return normalizeObjectWhenSell(agg, item);
          }
        });

    const actualYearValues = values[ACTUAL_YEAR] || [];

    const lastYearsPlusActualYear =
      lastYears != null ? [lastYears, ...actualYearValues] : actualYearValues;

    const hasOnlyOneValueActualYear = lastYearsPlusActualYear.length == 1;

    const actualYear = hasOnlyOneValueActualYear
      ? normalizeObject(lastYearsPlusActualYear[0])
      : _.reduce(lastYearsPlusActualYear, (agg, item) => {
          if (item.op == "C") {
            return normalizeObjectWhenBuy(agg, item);
          } else {
            return normalizeObjectWhenSell(agg, item);
          }
        });

    return {
      key,
      actualYear,
      lastYears,
    };
  });

  const formatedResult = await Promise.all(
    aggregatedValues.map(async ({ key, actualYear, lastYears }) => {
      let cnpj = null;

      if (!key.includes("34")) {
        cnpj = await getCNPJInfo(browser, key);
      }

      const median = actualYear.totalPrice / actualYear.quantity;

      return {
        cnpj,
        discriminacao: `${actualYear.quantity} AÇÕES ${key} PELO VALOR TOTAL DE R$ ${actualYear.totalPrice}, ONDE CADA AÇÃO CUSTOU O PREÇO MÉDIO DE R$ ${median}`,
        valorNoFinalDoAnoPassado:
          lastYears != null ? lastYears.totalPrice : lastYears,
        valorNoFinalDoAnoAtual: actualYear.totalPrice,
      };
    })
  );

  console.log(formatedResult);

  await browser.close();
})();
