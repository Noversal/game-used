# Requerimientos e Historias de Usuario

Este documento detalla las historias de usuario y los criterios de aceptación para el desarrollo del script de raspado de videojuegos usados.

---

## Historia de Usuario 1: Inicialización y Obtención de Páginas (Paginación)
**Como** analista de precios de videojuegos,  
**Quiero** inicializar un navegador automatizado, acceder a la web principal y extraer las URLs de paginación disponibles,  
**Para** conocer el número total de páginas y tener las direcciones preparadas antes de realizar la extracción.

### Criterios de Aceptación:
* El script debe iniciar una instancia de navegador en modo background (headless).
* Debe acceder a la dirección URL base definida en el proyecto.
* Debe capturar los enlaces de paginación de la interfaz descartando los botones de navegación no numéricos (como "Anterior" y "Siguiente").
* Debe generar y almacenar una lista limpia con las URLs de resultados correspondientes a cada página.

---

## Historia de Usuario 2: Recorrido Secuencial de Páginas
**Como** analista de precios de videojuegos,  
**Quiero** recorrer cada una de las URLs de paginación recopiladas automáticamente,  
**Para** poder procesar el contenido HTML de cada sección del catálogo.

### Criterios de Aceptación:
* El navegador automatizado debe navegar secuencialmente por cada una de las URLs del listado de páginas.
* Debe esperar a que el contenido de la página se descargue por completo antes de continuar con la extracción.
* Si el acceso a una de las páginas falla, el flujo debe continuar con las páginas restantes.

---

## Historia de Usuario 3: Extracción de Información de Productos (Parsing)
**Como** analista de precios de videojuegos,  
**Quiero** extraer de manera automatizada el nombre y el precio de cada videojuego del código HTML obtenido,  
**Para** transformar la información visual del catálogo en un formato estructurado.

### Criterios de Aceptación:
* El script debe identificar la grilla de productos y extraer para cada videojuego:
  * El nombre/título del juego.
  * El precio del juego (convertido a un formato numérico limpio para facilitar análisis posteriores).
* El procesamiento debe ser flexible para evitar que fallas menores en un elemento detengan la recolección de los demás juegos de la página.

---

## Historia de Usuario 4: Consolidación y Presentación en Terminal
**Como** usuario final del script,  
**Quiero** visualizar una lista única consolidada de todos los videojuegos encontrados con sus respectivos precios en la terminal,  
**Para** consultar de forma clara y legible el inventario extraído.

### Criterios de Aceptación:
* El script debe almacenar todos los elementos de todas las páginas en una única colección unificada.
* Al finalizar el recorrido de todas las páginas, debe formatear la salida en consola para mostrar la información en un formato ordenado y legible (por ejemplo, en forma de tabla).
* Debe cerrar de forma limpia la sesión del navegador para liberar memoria y recursos del sistema.
