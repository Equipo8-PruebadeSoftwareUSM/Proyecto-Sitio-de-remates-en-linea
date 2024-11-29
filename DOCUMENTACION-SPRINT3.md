# Documentación Proyecto Entrega 3
Equipo 8 INF331 Pruebas de Software
“Rincón del Olvido”
- Integrantes: Diego Veas | Carlos Vega | Pablo Campos | Luis Zegarra
- Profesor: Oscar Reyes H.
- Período estudiantil 2024-2.

**Link de pagina web:** https://proyecto-sitio-de-remates-en-linea.azurewebsites.net
#### Credenciales para usuario de prueba:
- user > user@example.com
- password > userpassword

## Alcances de la solución implementada
### Uso de Selenium::
Selenium es una herramienta de pruebas automatizadas de código abierto que se utiliza para comprobar el funcionamiento de aplicaciones web en varios navegadores. En nuestro caso utilizamos los drivers que selenium requería para que la página pudiera funcionar en Chrome.

Para esta entrega, utilizamos esta herramienta para realizar un conjunto de pruebas que busca garantizar la calidad y funcionalidad de la aplicación web. Las pruebas realizadas en Selenium se encargaban de abordar escenarios críticos para la funcionalidad de la aplicación.

Actualmente, las pruebas que se realizan con Selenium son:
- La validación de un usuario en el sistema.
- La creación de un producto nuevo en el catálogo.
- La identificación y validación de la información específica de dicho producto.
- La participación (exitosa) en el remate del producto de prueba.

## Descripción del trabajo realizado:
### Proyecto, paso a paso:
#### Entrega 1: 

En la primera entrega se nos presentó el problema del sitio de remates “Rincón del Olvido” ([link de situación actual](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/Tema-presentacion-proyecto.md)), la cual no podía seguir funcionando de manera presencial debido a la opresión de la Alianza Combineal y ataque de los alienígenas. La solución que se nos pidió implementar fue la creación de una sitio de remates, de manera simple,  para que los compradores (rebeldes y coleccionistas) pudieran realizar transacciones de manera rápida y segura.

Lo primero que hicimos fue el levantamiento primitivo de la página web, la cual soportaba implementaciones CRUD (create, read, update and delete) relacionadas a los productos que se publican en la tienda online, asimismo como la creación de usuarios que pudieran acceder a la página web. La base de datos utilizada fue DynamoDB, la cual es proporcionada por los servicios de Amazon Web Services (AWS) dentro de todos los servicios en la nube que disponen, es de uso gratuito, junto a el servicio de IAM para realizar las identificaciones con los permisos necesarios para las operaciones dentro de la base de datos, estos permisos son agregados dentro de las claves secretas que se pueden almacenar dentro de GitHub y luego dentro del código, se tienen que referenciar para obtenerlas y hacer uso de ellas.

Después de tener una creación exitosa del catálogo de productos, se implementó la función de la búsqueda de productos mediante un input ingresado por el cliente. Para realizar esto se extrae la información existente en la base de datos y se busca una compatibilidad entre la palabra ingresada por el cliente y el nombre de los productos existentes, en base a esto, la lista del catálogo se filtraba mostrando únicamente los productos que tuvieran una coincidencia (completa o parcial) con la palabra buscada. Si no había ningún producto con un nombre similar, la lista no mostraba ningún producto. Se incluyó un botón para cancelar la búsqueda realizada y volver al catálogo completo.

Terminada la implementación de la búsqueda de productos se agregó una página para poner en marcha el inicio de sesión, de forma que puedan acceder tanto usuarios como administradores. De esta forma limitar las acciones respectivas, debido a que al agregar las nuevas funciones, era ideal levantar el login en este punto. Así se pudo seguir con las demás funciones básicas, tales como editar y eliminar producto, estas últimas sólo puede realizarlas un administrador. 

Con todo esto, la página era capaz de permitir a un usuario ingresar su correo y contraseña para ser validados. Una vez hecho esto se le mostrará el formulario necesario para registrar un nuevo producto en el catálogo (el cual solo funcionará si el usuario cuenta con el rol de administrador) y abajo de esto, el usuario podrá ver el catálogo de productos existentes en la página web. (En el costado derecho de la información asociada a cada producto, hay botones para que el administrador pueda editar o eliminar dichos productos)

Ya en marcha las funciones que le permiten al usuario tener un flujo mínimo en el sitio, se tomó la decisión de ajustar el diseño de todo el sitio web, esto se hizo con css y bootstrap, de forma que se aseguró que sea un sitio responsivo. La interfaz de inicio de sesión se diseñó en torno al logo del sitio. Se hizo un recuadro con todos los campos para agregar y actualizar los productos en la parte superior de la página. La barra de búsqueda se diseñó con botones visualmente atractivos, claros y fáciles de usar, adoptando un neumorfismo.

Para finalizar, se modificó la tabla que contiene el catálogo diferenciando la cabecera de los productos, con un efecto hover para permitir una buena usabilidad al usuario. De modo que cada página del sitio es responsive, además de un diseño y estructura que mejoran la experiencia del usuario, permitiendo una navegación e interacción simple.    

Aplicamos Jest para realizar pruebas en el frontend y backend, mediante comandos, estos ejecutan una serie de pruebas que están definidas para comprobar las funcionalidades de nuestras funciones y conexiones. En un principio teníamos pensado implementar Mocha (Chai), pero por un problema de versiones de javascript y para poder utilizarlo era necesario reescribir todos los archivos .js desde el "common js" al "ES module", encadenado problemas de compatibilidad con librerías que ya habíamos implementado. También realizamos pruebas manuales, para ir comprobando la efectividad de nuestro código a medida que desarrollamos, este excel está disponible dentro del repositorio GitHub ([Link exel de pruebas manuales](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/CasosPruebaProyectoRinconV1.0.0-V3.0.0.xlsx)).

**Documentación entrega 1:** [Link GitHub Documento sprint 1](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/DOCUMENTACION.md).

---

#### Entrega 2:

En la segunda entrega se buscó integrar las dependencias necesarias para el despliegue del software en la web, para esto se utilizó Amazon Web Services (AWS) y Microsoft Azure (Azure App Service), en primer lugar se intentó hacer el despliegue con algún servicio de Amazon, pero tuvimos problemas con los cobros que realiza la página web, dado que la base de datos DynamoDB se enlazaba con un servicio que era de pago. Por este motivo, decidimos utilizar Azure App Service, ya que, con la cuenta institucional de la Universidad, nos entregan $100 de prueba, lo que nos daba una tranquilidad como equipo para utilizar los servicios sin preocuparnos por los cobros. La implementación no tuvo mucha dificultad, junto al uso de workflows en GitHub y un archivo .yml, se logra hacer la carga y actualización constante de la página web en Azure, cada vez que se detecta un push dentro de la rama main (todo esto lo hace de manera automática Azure, al agregar el repositorio en el cual está contenido el proyecto) .

Para implementar la autenticación del usuario se dividió la aplicación en dos partes principales, la primera es la página donde el usuario se autentica, donde inicia sesión, y la segunda es el sitio principal donde se encuentran más vistas, correspondientes al catálogo y de cada producto específico. Esto mediante la lógica de componentes que nos entrega React.
En esta etapa del proyecto el sistema verifica que el usuario ya esté autenticado para redirigir a la página del catálogo, esto gracias al manejo de estados que controla el sistema. Por contraparte, en la primera instancia de entrega al realizar la autenticación, el único cambio que había en la página era el contenido del catálogo, ahora está todo en vistas independientes.

El servidor de Jenkins es un contenedor de Docker que se ejecuta de manera local en uno de los ordenadores de los miembros del equipo. El pipeline comienza trayendo los últimos cambios de main a la instancia de Docker y ejecuta los test. Luego se conecta con una instancia de EC2 a través de ssh para buscar por nuevos cambios en main. Levanta del servidor de la página de subastas y ejecuta una verificación de que el servidor esté arriba.

Junto con lo mencionado previamente se realizaron dos requerimientos extra para el funcionamiento de nuestro sistema, los cuales fueron integrar una nueva vista  con el fin de poder ver la información asociada a un producto en específico, y dentro de esta misma vista habilitar la opción para que un usuario pudiera participar de un remate ofertando a un producto un monto mayor al que tiene actualmente registrado. Para la primera integración se agregó una nueva opción (un botón) para cada producto disponible en el catálogo que nos lleva a esta nueva vista. Se utiliza el ID asociado al producto para extraer su información de la base de datos, luego esta información se presenta en la nueva vista. Para la segunda integración se creó un modal que se muestra por encima de la información del producto, en este se le pide al usuario ingresar un monto para participar del remate. El monto debe ser mayor al actualmente ofertado, el sistema se encarga de verificar esto. Dicho monto será modificado en la base de datos, permitiendo que el producto tenga el nuevo valor asociado.

Con todo esto, ahora la página web puede:
1. Registrarse para poder acceder a la vista de los productos.
2. Ver la lista de productos. En el caso de ser un administrador, se puede: editar, borrar o crear un producto.p
3. Para crear un producto se deben completar todos los campos seleccionados.
4. Ver la descripción de un producto dentro de una pestaña propia.


Documentación entrega 2 : [Link GitHub Documento sprint 2](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/DOCUMENTACION-SPRINT2.md).

---

### Entrega 3:

Se nos solicita preparar un set de pruebas con Selenium para garantizar la calidad y funcionalidad de la aplicación web.  Para realizar esto se integraron 4 pruebas acumulativas que buscan simular acciones del usuario y verificar el comportamiento de la aplicación.
Estas pruebas son:
- loginTest.js: En esta prueba se busca simular un login exitoso en la página web.
- productTest.js: En esta prueba se realiza lo mismo que en la anterior, se integran las acciones necesarias para crear un producto de prueba rellenando el formulario de creación con información de testing, asimismo, este producto creado será eliminado antes de finalizar la prueba.
- detalleTest.js: En esta prueba se integran las acciones necesarias para poder ingresar a los detalles específicos del producto de prueba, con tal de confirmar que su información es la misma que fue ingresada previamente.
- remateTest.js: Esta prueba contiene todas las acciones de las pruebas mencionadas previamente, pero en el flujo se incluyen las acciones necesarias para poder ofertar en el remate asociado al producto de prueba. En este caso, la oferta debe ser realizada exitosamente, pues sabemos que el monto que estamos ingresando en esta sección es mayor al monto con el cual se creó el producto de prueba.

También se nos pedía configurar Jenkins de tal forma que se pudieran ejecutar las pruebas de Selenium al momento en que ocurriera una modificación en el código fuente, esto no se pudo lograr. (Un factor fue el poco tiempo que tuvimos como equipo para trabajar en esto)
El sistema de Jenkins (contenedor de docker que se ejecuta en linux mint 20.3) tiene incompatibilidades con las librerías selenium-webdriver y chromedriver las cuales se utilizaron para ejecutar las pruebas de Selenium. Se intentó actualizar las versiones de node pero aun así no se logran detectar las dependencias, por lo que las pruebas creadas en selenium no se logran ejecutar de manera automática. 
Decidimos dejar las pruebas de Selenium fuera de la pipeline de Jenkins, esto para evitar errores en el flujo del sistema. Creemos que con más tiempo y la configuración correcta de nuestro proyecto, se pueden integrar estas herramientas correctamente.

## Problemas encontrados y soluciones:
### Entrega 1:
- **Comunicación y avance interferido por los tiempos disponibles entre los integrantes debido a otros trabajos:** Los tiempos de desarrollo se vieron alargados debido a un conflicto con otras entregas, el tiempo invertido en el desarrollo estuvo dentro de los rangos esperados, pero nuestro avance se vio ralentizado al momento de coordinar los avances.
- **Detalles en el código que permitían (o impedían) correr el programa:** En nuestro caso utilizamos .env y Postman para la carga de información de los productos, manejar el registro de usuarios y realizar la verificación de los usuarios en la página web. Por temas de seguridad, el archivo .env debía ser creado de forma manual cada vez que el programa fuera clonado con los nuevos cambios realizados, a veces se nos olvidaba hacer esto y perdíamos tiempo pensando en que la falla venía de otra parte.
- **Problemas de compatibilidad entre la herramienta de testing y la aplicación desarrollada:** Para poder utilizar Mocha(Chai) con la aplicación que tenemos desarrollada, era necesario reescribir todos los archivos .js desde el "common js" al "ES module", pues este cambio permitiría el uso de Mocha. Aún así, al realizar este cambio en la sintaxis se levantaban otros problemas de compatibilidad con otras partes del programa. Se optó por no hacer estos cambios debido al rework que esto implicaba y el tiempo límite de la entrega. Técnicamente este fue un problema de compatibilidad con la herramienta de testing elegida, pero esto no significaba que el programa realizado tuviera fallas de gravedad que no pudieran ser demostradas por otras herramientas de testing. Tuvimos que ajustarnos a las circunstancias con el fin de cumplir con nuestro objetivo principal de entregar un programa que soluciona el problema de la aplicación web para la tienda de Remates Rincón del Olvido.

---

### Entrega 2:
- **Dificultades en la comunicación con la base de datos:** Debido a las nuevas funciones que se crearon para la pestaña enfocada en la información de un producto específico, hubieron problemas de comprensión para realizar el llamado desde la base de datos y utilizar esta información para encontrar un producto. Esto se soluciono al comunicar esta dificultad con el equipo, la persona encargada de hacer las comunicaciones en la primera entrega ayudó a entender el programa, luego de eso se pudo identificar fácilmente el producto en base a su id y el programa funcionó como se esperaba.
- **Ejecutar Jenkins en Windows de manera local:** traía problemas a la hora se conectar Jenkins con EC2 debido a incompatibilidades en los permisos, Se procedió por la alternativa Linux + Docker.
- **Integrar la pipeline de Jenkins:** recibir los webhooks de Git y que está trigger en la build de Jenkins para hacerla realmente continua. El problema es que al ejecutar Jenkins de manera local en un contenedor tiene problemas para detectar los webhook. Se intentó realizar con unos servidores que actúan como túneles, pero versiones gratis cambian la ip y destruye las build. Otra opción era cambiar la configuración del docker-compose y dockerfile pero no fue realizado exitosamente, por lo que este approach tampoco funcionó. Actualmente se ejecuta la pipeline cada 30 min como parche, la solución ideal sería montar Jenkins en su propia instancia o vm.
- **Desplegar la aplicación en Azure App Service con credenciales:** necesitábamos proporcionar las credenciales necesarias para que pudiera conectarse con la base de datos. Este proceso nos generó algunos problemas, ya que desconocíamos cómo realizar dicha conexión de manera efectiva. Posteriormente, descubrimos que podíamos agregar las credenciales tanto en el apartado de llaves en GitHub Actions como en la configuración de Azure. Esto resolvió los inconvenientes que enfrentamos.

---

### Entrega 3:
- **Implementar Selenium con la página web:** debido al desconocimiento de la herramienta, realizar la implementación para que pudiera ejecutar las pruebas  dentro de la página web no fue un paso sencillo. Se tuvo que realizar una investigación exhaustiva para lograr que las acciones de selenium reaccionaran. Existieron algunos problemas en la creación de casos de pruebas, pues era difícil de identificar la causa de los errores, la gran mayoría fueron errores causados porque Selenium ejecuta las acciones muy rápido, se arregló poniendo delays entremedio del flujo.
- **Tiempo de desarrollo:** como equipo tratamos de planificarlo de la mejor manera el sprint 3, pero como son las últimas fechas del semestre académico, los tiempos de cada uno se redujeron drásticamente, esto llevó a que no pudiéramos realizar reuniones para comentar el avance, culminando en una reunión express para dejar todo terminado y encaminado a la entrega final.
- **Integrar Selenium con Jenkins:** Existieron ciertas incompatibilidades que no pudieron solucionar por falta de experiencia o malas configuraciones en el ambiente de Jenkins. El entorno bajo el cual está corriendo Jenkins es un contenedor de docker que se ejecuta en linux mint 20.3. El sistema presenta cierta incompatibilidad con las librerías selenium-webdriver y chromedriver. ya que no las detecta en tiempo de ejecución o recalca ciertas incompatibilidades con las versiones de node usadas. Se intentó actualizar las versiones de node pero aun así no logra detectar las dependencias y ejecutar las pruebas creadas de selenium de manera automática. Decidimos dejarlo fuera de la pipeline para evitar errores pero creemos que con más tiempo y la configuración correcta se puede integrar jenkins y las pruebas de selenium correctamente.
