# Equipo 8 Proyecto-Sitio-de-remates-en-linea
Proyecto para ramo Prueba de Software de la Universidad Federico Santa Maria.

## Autores
- Diego Veas
- Carlos Vega
- Pablo Campos
- Luis Zegarra

### Herramienta de testing: 
 ~~Mocha(Chai)~~ fue reemplazada y se utilizó **Jest** debido a problemas de compatibilidad (más explicado en la documentación para Entrega 1)
### Tecnologías a usar en el proyecto: 
ReactJS (Front-end) + NodeJS(Back-end) + AWS Dynamo

---

* Video autoexplicativo del trabajo realizado en Entrega 1: [Link Video Entrega 1](https://www.youtube.com/watch?v=KKrtQzG_7Nk)
* Video autoexplicativo del trabajo realizado en Entrega 2: [Link Video Entrega 2](https://youtu.be/pf3v5T0H4-g?si=D3eSNRvD5VJZY2Sx)
* Video autoexplicativo del trabajo realizado en Entrega 2: [Link Video Entrega 3](https://www.youtube.com/watch?v=e2LkHVpbyrY) 

* Desarrollo de Documentación para Entrega 1: [Link Documentación Entrega 1](DOCUMENTACION-SPRINT1.md)
* Desarrollo de Documentación para Entrega 2: [Link Documentación Entrega 2](DOCUMENTACION-SPRINT2.md)
* Desarrollo de Documentación para Entrega 3: [Link Documentación Entrega 3](DOCUMENTACION-SPRINT3.md)

* Link página web (Disponible a la fecha 25/11/2024): https://proyecto-sitio-de-remates-en-linea.azurewebsites.net/
> [!IMPORTANT]
> Solo se puede acceder con una cuenta creada por un administrador.
> Fue creado de esta forma por lo planteado en la descripción del caso ([Historia del caso](https://github.com/Equipo8-PruebadeSoftwareUSM/Proyecto-Sitio-de-remates-en-linea/blob/main/Tema-presentacion-proyecto.md)).

#### Usuario para probar la aplicación
```
username: user@example.com
password: userpassword
```

## Instrucciones de instalación
1. Verificar si esta instalado npm y node
```
node -v
```
```
npm -v
```

2. Acceder a la carpeta clonada e instalar dependencias
```
npm install express body-parser @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb multer winston dotenv 
npm install jsonwebtoken
npm install bcryptjs
npm install jest supertest
npm install selenium-webdriver
npm install chromedriver

```

3. Ejecutar servidor
```
node server/server.js
# npm start
```

4. Finalmente ir a localhost y probar la aplicación
```
http://localhost:3000
```

* Usuario para probar la aplicación
```
username: user@example.com
password: userpassword
```


Si desea ejecutar las pruebas de Jest, deberá ejecutar el siguiente código en la cmd:
```
npm test
```

Si desea ejecutar las pruebas de Selenium, deberá ejecutar el servidor en una cmd, y en otra ejecutar los siguientes comandos:
```
node server/loginTest.js
node server/productTest.js
node server/detalleTest.js
node server/remateTest.js
```

## Dependencias instaladas/utilizadas

- express
- body-parser 
- @aws-sdk/client-dynamodb 
- @aws-sdk/lib-dynamodb
- *dotenv*: para cargar el .env
- *winston*: para logs
- multer: manejo de archivos en imagenes
- jsonwebtoken
- bcryptjs
- jest supertest: testing
- selenium-webdriver: testing con selenium
- chromedriver: driver para levantar testing de selenium en chrome


## Links

- [link de 'AWS DynamoDB for javascript'](https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/programming-with-javascript.html)
- [Operaciones dentro de AWSDynamoBd](https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/workbench.querybuilder.operationbuilder.api.html#workbench.querybuilder.operationbuilder.Put)
- [link Azure](https://learn.microsoft.com/es-mx/azure/app-service/quickstart-nodejs?tabs=windows&pivots=development-environment-vscode)



EC2
Jenkins v3
