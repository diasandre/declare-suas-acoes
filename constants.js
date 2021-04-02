export const BASE_URL =
  "https://ceiapp.b3.com.br/CEI_Responsivo/negociacao-de-ativos.aspx";

export const LOGIN_URL = "https://ceiapp.b3.com.br/CEI_Responsivo/login.aspx";

export const SELECTORS = {
  LOGIN_FIELD: "#ctl00_ContentPlaceHolder1_txtLogin",
  PASSWORD_FIELD: "#ctl00_ContentPlaceHolder1_txtSenha",
  LOGIN_BUTTON: "#ctl00_ContentPlaceHolder1_btnLogar",
  AGENT_SELECT_SELECTOR: "select#ctl00_ContentPlaceHolder1_ddlAgentes option",
  AGENT_SELECT: "#ctl00_ContentPlaceHolder1_ddlAgentes",
  START_DATE: "#ctl00_ContentPlaceHolder1_txtDataDeBolsa",
  END_DATE: "#ctl00_ContentPlaceHolder1_txtDataAteBolsa",
  SEARCH_BUTTON: "#ctl00_ContentPlaceHolder1_btnConsultar",
  RESULT_DIV_ID: "#ctl00_ContentPlaceHolder1_pnBolsa",
};

export const VALUES = {
  DATE: "Data do Negócio",
  OP: "Compra/Venda",
  ID: "Código Negociação",
  QUANTITY: "Quantidade",
  PRICE: "Preço (R$)",
  TOTAL_PRICE: "Valor Total(R$)",
};

export const DATE_FORMAT = "DD/MM/YYYY";

export const ACTUAL_YEAR = "actual-year";
export const LAST_YEARS = "last-years";
