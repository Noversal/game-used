# Game Used Scraper 🎮

Este proyecto es un script automatizado desarrollado en **TypeScript** que realiza web scraping en la sección de videojuegos usados del catálogo de Soy Gamer Argentina. El objetivo es obtener de forma estructurada los nombres, plataformas de consola y precios de los videojuegos publicados, limpiando los títulos (removiendo palabras como "usado", "used" y sus variaciones) y presentándolos en una tabla ordenada en la terminal.

## Tecnologías Utilizadas 🛠️

*   **TypeScript**: Lenguaje principal de desarrollo.
*   **Puppeteer**: Para la automatización del navegador web (ejecución *headless* con soporte `--no-sandbox`).
*   **Cheerio**: Para el parsing rápido y eficiente del HTML extraído.
*   **esbuild**: Para compilar y empaquetar el código TypeScript en un único archivo JavaScript ligero (`dist/index.js`).
*   **Docker**: Para asegurar la portabilidad y la correcta instalación de dependencias complejas de Chromium en entornos Linux sin interfaz gráfica.

---

## Estructura del Proyecto 📂

*   [index.ts](file:///home/noversal/dev/gameUsed/index.ts): Código fuente principal del scraper. Gestiona el ciclo de vida del navegador, el paginado, la navegación secuencial y la salida de datos.
*   [build.js](file:///home/noversal/dev/gameUsed/build.js): Script de configuración de `esbuild` para generar la distribución compilada.
*   [Dockerfile](file:///home/noversal/dev/gameUsed/Dockerfile): Configuración de Docker en dos etapas (*multi-stage*): una de compilación y otra de ejecución con Google Chrome instalado de forma oficial y estable.
*   [package.json](file:///home/noversal/dev/gameUsed/package.json): Gestión de scripts y dependencias.
*   [requirements.md](file:///home/noversal/dev/gameUsed/requirements.md): Historias de usuario y criterios de aceptación del desarrollo.

---

## Cómo Ejecutar el Proyecto con Docker 🐳

Para evitar problemas de compatibilidad con las dependencias nativas de Puppeteer y Chromium en tu máquina local, la forma recomendada y más sencilla de correr el script es mediante **Docker**.

### Requisitos Previos

*   Tener **Docker** instalado y ejecutándose en tu sistema.

### Paso 1: Clonar el repositorio

Clona el repositorio en tu máquina local y accede al directorio del proyecto:

```bash
git clone https://github.com/Noversal/game-used.git
cd game-used
```

### Paso 2: Construir la imagen de Docker

Abre tu terminal en el directorio raíz del proyecto y ejecuta el siguiente comando para compilar la aplicación y construir la imagen:

```bash
docker build -t game-used-scraper .
```

*Este paso descargará la imagen base de Node, instalará las dependencias necesarias de Chrome y compilará el código de TypeScript.*

### Paso 3: Ejecutar el contenedor

Una vez que la imagen se haya construido correctamente, ejecuta el contenedor con el siguiente comando:

```bash
docker run --rm game-used-scraper
```

*(El parámetro `--rm` se utiliza para que el contenedor se elimine automáticamente una vez finalice la ejecución, liberando recursos).*

---

## Cómo Ver el Resultado 📊

Al iniciar el contenedor, el scraper comenzará a ejecutarse y verás en la terminal la tabla de resultados.

El script realiza las siguientes transformaciones a los datos antes de mostrarlos:
1. **Limpieza de Título:** Elimina variaciones de la palabra "usado" o "used" (por ejemplo: "usado", "usada", "usados", etc.) y signos de puntuación adicionales.
2. **Extracción de Consola:** Identifica la plataforma/consola del videojuego (como PS3, PS4, PS5, Switch) a partir del final del título y la muestra en una columna separada.

### Ejemplo de salida en la terminal:

```text
┌─────────┬─────────────┬────────────────────────────────────────────────────┬──────────────┐
│ (index) │ gameConsole │ name                                               │ price        │
├─────────┼─────────────┼────────────────────────────────────────────────────┼──────────────┤
│ 0       │ 'PS4'       │ 'Bloodborne'                                       │ '$ 24000.00' │
│ 1       │ 'PS3'       │ 'Street Fighter x Tekken'                          │ '$ 25000.00' │
│ 2       │ 'PS3'       │ 'Call Of Duty Advanced Warfare'                    │ '$ 18000.00' │
│ 3       │ 'PS3'       │ 'Diablo 3'                                         │ '$ 15000.00' │
│ 4       │ 'PS5'       │ 'Spiderman 2'                                      │ '$ 55000.00' │
│ ...     │ ...         │ ...                                                │ ...          │
└─────────┴─────────────┴────────────────────────────────────────────────────┴──────────────┘
```

