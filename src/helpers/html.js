import config from "../configurations";
import dayjs from "./dayjsLocale";
import juice from "juice";
import { minify } from "html-minifier-terser";
import { getFilePublic } from "./path";

const minifyHtml = (html) => {
  const inlinedHtml = juice(html);

  const minifiedHtml = minify(inlinedHtml, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs : true
  });

  return minifiedHtml;
};

const getHtml = async (nameFile, propsHtml = {}) => {
  const { userName = "User", header = "Your title", buttonName = "Button name", link = "", expiredLabel = "" } = propsHtml;
  const date = dayjs();

  let html = await getFilePublic("html", nameFile);

  html = html.replace(/{{userName}}/g, userName);
  html = html.replace(/{{header}}/g, header);
  html = html.replace(/{{buttonName}}/g, buttonName);
  html = html.replace(/{{link}}/g, `${config.baseUrl}/landing/${link}`);
  html = html.replace(/{{expiredLabel}}/g, expiredLabel);
  html = html.replace(/{{brand}}/g, "Kalkulator Stunting");
  html = html.replace(/{{day}}/g, date.date().toString());
  html = html.replace(/{{month}}/g, date.format("MMMM"));
  html = html.replace(/{{year}}/g, date.year().toString());

  const minified = minifyHtml(html);

  return minified;
};

export { getHtml, minifyHtml };
