import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../configurations';
import dayjs from './dayjsLocale';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getHtml = async (nameFile, propsHtml = {}) => {
  const { userName = 'User', header = 'Your title', buttonName = 'Button name', link = '', expiredLabel = '' } = propsHtml;
  const date = dayjs();

  const filePath = path.join(__dirname, 'html', nameFile);
  let html = await fs.readFile(filePath, 'utf-8');

  html = html.replace(/{{userName}}/g, userName);
  html = html.replace(/{{header}}/g, header);
  html = html.replace(/{{buttonName}}/g, buttonName);
  html = html.replace( /{{link}}/g, `${config.baseUrl}/landing/${link}` );
  html = html.replace(/{{expiredLabel}}/g, expiredLabel);
  html = html.replace(/{{brand}}/g, `Kalkulator Stunting`);
  html = html.replace(/{{day}}/g, date.date().toString());
  html = html.replace(/{{month}}/g, date.format('MMMM'));
  html = html.replace(/{{year}}/g, date.year().toString());

  return html;
};

export default getHtml;
