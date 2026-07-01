import puppeteer, { Browser, Page } from 'puppeteer';
import { load } from 'cheerio';
import { createSpinner } from 'nanospinner';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const navigationPage = async ({ page, currentPage }: { page: Page, currentPage: string }) => {
    await page.goto(currentPage);

    const content = await page.content();
    if (!content) {
        throw new Error('No content found');
    }
    const $ = load(content);

    const productDescription = $(".product-desc").toArray();

    const detailsGames: [string, string][] = [];

    for (const product of productDescription) {
        const title = $(product).find('.product-title h3').text();
        const price = $(product).find('.product-price ins').text();
        detailsGames.push([title, price]);
    }

    return detailsGames;
}

const cleanTitle = (rawTitle: string) => {
    return rawTitle
        .replace(/[-–—]?\s*[\(\[\{]?\s*\b(usado[as]?|used)\b\s*[\)\]\}]?\s*[-–—]?/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export const scrapeGames = async () => {
    const URI = 'https://www.soygamerargentina.com/buscar/IDDE0_1_usados/';

    // Spinner para inicio del navegador
    const initSpinner = createSpinner('Iniciando navegador y cargando página principal...').start();

    const browser: Browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page: Page = await browser.newPage();

    await page.goto(URI);

    const content = await page.content();

    if (!content) {
        initSpinner.error({ text: 'Error: No se encontró contenido en la página principal.' });
        await browser.close();
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
        await sleep(2000);
    }

    initSpinner.success({ text: `Conexión exitosa. Se encontraron ${pages.length} páginas para procesar.` });

    // Spinner para recorrer las páginas de productos
    const pagesWithContent: [string, string][][] = [];
    const scrapeSpinner = createSpinner(`Procesando páginas... (0/${pages.length})`).start();

    for (let i = 0; i < pages.length; i++) {
        const linkPage = pages[i];
        scrapeSpinner.update({ text: `Procesando página ${i + 1}/${pages.length}: ${linkPage}` });
        const content = await navigationPage({ page, currentPage: linkPage });
        pagesWithContent.push(content);
        await sleep(2000);
    }

    const allGames = pagesWithContent.flat();
    scrapeSpinner.success({ text: `Scraping completado. Extraídos ${allGames.length} videojuegos.` });

    // Spinner para limpiar datos
    const cleaningSpinner = createSpinner('Limpiando y estructurando listado...').start();
    const cleanList = allGames.map(([title, price]) => [cleanTitle(title), price]);

    const result = cleanList.map(([title, price]) => {
        const titleSplit = title.split(' ');
        const gameConsole = titleSplit.pop()?.toUpperCase();
        const name = titleSplit.join(' ');
        return { gameConsole, name, price }
    });
    cleaningSpinner.success({ text: 'Listado limpio y formateado con éxito.' });

    // Cerrar navegador
    const closeSpinner = createSpinner('Cerrando navegador...').start();
    await browser.close();
    closeSpinner.success({ text: 'Navegador cerrado.' });

    return result;
};