# Documentación Entrega 2
Video autoexplicativo del trabajo realizado en Entrega 2: [Link Video Entrega 2](https://youtu.be/pf3v5T0H4-g?si=D3eSNRvD5VJZY2Sx)

## Alcances de la herramienta
### Herramienta de testing: Jest (React JS), Supertest
Jest es un framework de testing desarrollado por Facebook, ideal para aplicaciones React. Permite hacer pruebas unitarias, asíncronas y de integración, tanto en frontend como backend.

- Cliente (React): Prueba componentes, renderizado, y eventos de usuario.
- Servidor (Node.js): Soporta pruebas de controladores y APIs.

Características: Mocks automáticos, pruebas snapshot, compatible con Enzyme y React Testing Library.

### Dependencias para el despliegue de Software: 
- Amazon Web Services 
  - AWSDynamoDB (Base Datos NoSQL)
- Microsoft Azure
  - Azure App Service

Amazon Web Services (AWS) y Microsoft Azure son plataformas en la nube que ofrecen diversos servicios aplicados al desarrollo de aplicaciones y software. Para este proyecto, se utilizó la base de datos DynamoDB en AWS debido a que es de tipo NoSQL, es decir, no relacional, lo cual permite una mejor organización de datos. En este caso, se buscó replicar una estructura de tipo columnas de familias para organizar los datos de manera más eficiente, facilitando la búsqueda y el filtrado.
Intentamos implementar el Web Service proporcionado por AWS, pero surgieron inconvenientes con los cobros generados por aplicaciones complementarias en el ecosistema, a pesar de que DynamoDB supuestamente cuenta con una versión gratuita. Debido a que ya habíamos configurado la base de datos en AWS y no disponíamos de tiempo para realizar una migración completa de la aplicación, decidimos mantener la base de datos en AWS y utilizar el servicio de Azure App Service para desplegar la página web y hacerla accesible en internet.
Cabe mencionar que, gracias a la cuenta de la Universidad, contamos con un crédito de $100, lo cual nos brinda un margen de trabajo y seguridad como equipo, aunque estemos utilizando versiones gratuitas. Para conectar los servicios entre nubes, empleamos GitHub para almacenar el repositorio. Agregamos las credenciales en la sección de “Actions”, lo cual ofrece seguridad al proyecto respecto a datos sensibles, como claves. Luego, trabajamos con GitHub Workflows para crear un archivo .yml que mantiene la conexión con Azure, de manera que cada vez que se realiza un push a la rama main, la página se despliega en la nube automáticamente.

Link página web: https://proyecto-sitio-de-remates-en-linea.azurewebsites.net/

## Descripción del trabajo realizado
### Proyecto:
El caso de estudio que fue escogido para este proyecto fue el "Sitio de remates en linea: Rincón del olvido"
- Problema: Impedimento en el funcionamiento de la tienda de manera presencial debido a una cuarentena forzada.
- Solución: Creación de una tienda online para que los compradores (rebeldes y coleccionistas) puedan realizar transacciones de manera rápida y segura.

Para la **primera entrega** de este proyecto, las funcionalidades realizadas fueron: 
- Funcionalidades CRUD para usuarios permitidos en la página web.
- Creación de productos con detalles específicos de este, como el nombre del producto, su descripción, la duración en remate, precio y una o más imágenes.
- Búsqueda de productos disponibles en un catálogo.
- Interfaz de Administración para el dueño de la tienda.
- Seguridad y rapidez en la carga de datos para los usuarios.
- Editar la información referente al remate de un producto para mantenerla actualizada. 

Para la **segunda entrega** de este proyecto, los requerimientos realizados fueron:
- *Requerimiento pendiente de la entrega 1*: Se realizó la separación entre las vistas de login y el listado de productos.
- *Objetivo a realizar en esta entrega*: Se desplegó en la nube el código almacenado en github para que la página se pueda cargar de forma no local.
- *Nuevo requerimiento*: Se integró una nueva vista enfocada en mostrar las especificaciones de un producto en específico del listado.
- *Nuevo requerimiento*: Se habilitó la opción para que el usuario pueda participar en un remate ofreciendo un valor que pueda modificar el precio del producto (con las restricciones respectivas: el monto no podía ser un valor vacío o menor al actual) 
- *Pipeline que realiza integración y entrega discontinua. A través de jenkins y aws.*

## Dependencias entre la herramienta y la aplicación:
Las tecnologías utilizadas en este proyecto fueron:
- Jira, Slack, Whatsapp, Github y Discord: Trabajo y comunicación coordinado.
- AWS Dynamo: Almacenamiento de las bases de datos de los productos y los usuarios.
- Microsoft Azure: Se utiliza el servicio de Azure App Service para hospedar la página web.
- ReactJs y NodeJs, Npm: Herramientas para manejar el frontend y el backend (server).
- Jenkins, Aws Ec2, Docker.

### Uso de Jenkins
El server de jenkins es un contenedor de docker que se ejecuta de manera local en uno de los ordenadores de los miembros del equipo. El pipeline comienza trayendo los últimos cambios de main a la instancia de docker y ejecuta los test. Luego se conecta con una instancia de EC2 a través de ssh para buscar por nuevos cambios en main. Levanta del servidor de la página de subastas y ejecuta una verificación de que el servidor esté arriba.

## Problemas encontrados y soluciones
Algunos problemas con los que nos encontramos al momento de desarrollar el programa para la segunda entrega fueron:
- Dificultades en la comunicación con la base de datos: Debido a las nuevas funciones que se crearon para la pestaña enfocada en la información de un producto específico, hubieron problemas de comprensión para realizar el llamado desde la base de datos y utilizar esta información para encontrar un producto. Esto se soluciono al comunicar esta dificultad con el equipo, la persona encargada de hacer las comunicaciones en la primera entrega ayudó a entender el programa, luego de eso se pudo identificar fácilmente el producto en base a su id y el programa funcionó como se esperaba.
- Uno de los problemas encontrados fue ejecutar Jenkins en windows de manera local, lo que traía problemas a la hora se conectar jenkins con Ec2 debido a incompatibilidades en los permisos, Se procedió por la alternativa Linux + Docker.
- Otro de los problemas encontrados al integrar la pipeline de jenkins es, intentar recibir los webhooks de git y que está trigger en la build de jenkins para hacerla realmente continua.El problema es que al ejecutar Jenkins de manera local en un contenedor tiene problemas para detectar los webhook. Se intentó realizar con unos servidores que actúan como túneles, pero versiones gratis cambian la ip y destruye las build. Lo otro es cambiar la configuración del docker-compose y dockerfile pero fue mal hecha por lo que este approach tampoco funcionó. Actualmente se ejecuta la pipeline cada 30 min como parche, la solución ideal es montar jenkins en su propia instancia o vm.
- Para desplegar la aplicación en Azure App Service, necesitábamos proporcionar las credenciales necesarias para que pudiera conectarse con la base de datos. Este proceso nos generó algunos problemas, ya que desconocíamos cómo realizar dicha conexión de manera efectiva. Posteriormente, descubrimos que podíamos agregar las credenciales tanto en el apartado de llaves en GitHub Actions como en la configuración de Azure. Esto resolvió los inconvenientes que enfrentábamos.
