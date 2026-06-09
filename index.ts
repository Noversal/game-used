import puppeteer, { Browser, Page } from 'puppeteer';
import { load } from 'cheerio';


(async () => {
    const URI = 'https://www.soygamerargentina.com/buscar/IDDE0_1_usados/';

    const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page: Page = await browser.newPage();

    await page.goto(URI);

    const content = await page.content();

    if (!content) {
        throw new Error('No content found');
    }

    const $ = load(content);

    const links = $('.page-link').toArray();

    const pages: string[] = [];

    for (let i = 0; i < links.length; i++) {
        // Skip the first and last links, which represent the "Previous" and "Next" buttons
        if (i === 0 || i === links.length - 1) continue;

        const link = links[i];
        const linkUrl = link.attribs.href;
        const query = new URLSearchParams(linkUrl);
        const pageNumber = query.get("paginaActual")

        pages.push(`${URI}?paginaActual=${pageNumber}`);
    }

    await browser.close();
})();