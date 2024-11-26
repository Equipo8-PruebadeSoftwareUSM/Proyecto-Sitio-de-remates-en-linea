# Desarrollo de Documentación

### Equipo 8 INF331 Pruebas de Software

**Integrantes:** Diego Veas | Carlos Vega | Pablo Campos | Luis Zegarra

**Profesor:** Oscar Reyes H.

Período estudiantil **2024-2.**


## Alcances de la herramienta

Originalmente se tenia planificado utilizar la herramienta de testing **Mocha(Chai)**, pero debido a problemas de incompatibilidad de versiones con nuestro programa y limitaciones por el tiempo límite de la entrega, tuvimos que optar por otra herramienta de testing, la herramienta utilizada para esta entrega fue **Jest.**

### Herramienta de testing: Mocha (Chai)

Mocha es un marco de pruebas de JavaScript que se ejecuta en Node.js y en el navegador, lo nos permite realizar pruebas unitarias y asíncronas. Chai es una librería de aserciones (verificaciones) que se suele utilizar junto con Mocha. Esta herramienta nos deja probar código del lado del servidor (Manejo de peticiones, bases de datos, etc.) o del lado del cliente (Interfaz).

### Herramienta de testing: Jest (React JS), Supertest

Jest es un framework de testing desarrollado por Facebook, ideal para aplicaciones React. Permite hacer pruebas unitarias, asíncronas y de integración, tanto en frontend como backend.
* Cliente (React): Prueba componentes, renderizado, y eventos de usuario.
* Servidor (Node.js): Soporta pruebas de controladores y APIs.
  
Características: Mocks automáticos, pruebas snapshot, compatible con Enzyme y React Testing Library.


## Descripción del trabajo realizado

### Proyecto:
El caso de estudio que fue escogido para este proyecto fue el "Sitio de remates en linea: Rincón del olvido" ([Historia del caso](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/Tema-presentacion-proyecto.md))
* **Problema:** Impedimento en el funcionamiento de la tienda de manera presencial debido a la opresión de la Alianza Combineal y ataque de los alienigenas.
* **Solución:** Creación de una tienda online para que los compradores (rebeldes y coleccionistas) puedan realizar transacciones de manera rápida y segura.

En este proyecto nos enfocaremos en implementar un **CRUD (create, read, update and delete)** de las funcionalidades principales de la página web.
* Búsqueda de productos mediante un catálogo. 
* Creación de productos con detalles específicos de este, como el nombre del producto, su descripción, la duración en remate, precio y una o más imágenes.
* Información actualizada referente al remate del producto.
* Interfaz de Administración para el dueño de la tienda.
* Seguridad y rapidez en la carga de datos para los usuarios.

### Dependencias entre la herramienta y la aplicación:
Las tecnologías utilizadas en este proyecto fueron:
* Jira, Slack, Whatsapp, Github y Discord: Trabajo y comunicación coordinado.
* AWS Dynamo: Almacenamiento de las bases de datos de los productos y los usuarios.
* ReactJs y NodeJs: Herramientas para manejar el frontend y el backend (server).


## Pruebas

### Estrategia de pruebas utilizadas:
Se utilizó una estrategia iterativa en el desarrollo del programa. A medida que se completaba una HU definida por el grupo, se realizaba un ciclo de pruebas en la nueva versión antes de que esta se subiera en el repositorio de Git.

### Procedimiento de ejecución de pruebas:
La persona encargada de desarrollar el código que implementara la nueva HU, era quien realizaba pruebas manuales para demostrar su correcto funcionamiento. Luego de que estos cambios fueran subidos en Git, el resto del grupo podia realizar las mismas pruebas para ver que todo se ejecutara como correspondiera, y asi mismo poder ver cuales fueron las nuevas partes implementadas en el código.

### Reporte de resultados:
[Archivo Excel con las pruebas realizadas.](CasosPruebaProyectoRinconV1.0.0-V3.0.0.xlsx)

## Problemas encontrados y soluciones
Algunos problemas con los que nos encontramos al momento de desarrollar el programa fueron:
* **Comunicación y avance interferido por los tiempos disponibles entre los integrantes debido a otros trabajos:** Los tiempos de desarrollo se vieron alargados debido a un conflicto con otras entregas, el tiempo invertido en el desarrollo estuvo dentro de los rangos esperados, pero nuestro avance se vio ralentizado al momento de coordinar los avances.
* **Detalles en el código que permitían (o impedían) correr el programa:** En nuestro caso utilizamos .env y Postman para la carga de información de los productos, manejar el registro de usuarios y realizar la verificación de los usuarios en la página web. Por temas de seguridad, el archivo .env debia ser creado de forma manual cada vez que el programa fuera clonado con los nuevos cambios realizados, a veces se nos olvidaba hacer esto y perdiamos tiempo pensando en que la falla venia de otra parte.
* **Problemas de compatibilidad entre la herramienta de testing y la aplicación desarrollada:** Para poder utilizar Mocha(Chai) con la aplicación que tenemos desarrollada, era necesario reescribir todos los archivos .js desde el "common js" al "ES module", pues este cambio permitiría el uso de Mocha. Aún asi, al realizar este cambio en la sintaxis se levantaban otros problemas de compatibilidad con otras partes del programa. Se optó por no hacer estos cambios debido al rework que esto implicaba y el tiempo límite de la entrega. Técnicamente este fue un problema de compatibilidad con la herramienta de testing elegida, pero esto no significaba que el programa realizado tuviera fallas de gravedad que no pudieran ser demostradas por otras herramientas de testing. Tuvimos que ajustarnos a las circunstancias con el fin de cumplir con nuestro objetivo principal de entregar un programa que solucionara el problema de la aplicación web para la tienda de Remates Rincón del Olvido.

