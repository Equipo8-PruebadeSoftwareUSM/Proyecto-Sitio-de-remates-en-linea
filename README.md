# Equipo 8 Proyecto-Sitio-de-remates-en-linea
Proyecto para ramo Prueba de Software de la Universidad Federico Santa Maria.

## Autores
- Diego Veas
- Carlos Vega
- Pablo Campos
- Luis Zegarra

### Herramienta de testing: 
 ~~Mocha(Chai)~~ fue reemplazada y se utilizó **Jest** debido a problemas de compatibilidad (más explicado en la documentación)
### Tecnologías a usar en el proyecto: 
ReactJS (Front-end) + NodeJS(Back-end) + AWS Dynamo

---

* Video autoexplicativo del trabajo realizado: [Link Video](https://www.youtube.com/watch?v=KKrtQzG_7Nk)

* Desarrollo de Documentación: [Link Documentación](DOCUMENTACION.md)

>[!IMPORTANT]
> Este proyecto no va a funcionar si las credenciales no están disponibles dentro del repositorio (`.env`).
> Esto sirve para la conexión con la base de datos.
>
> El proyecto fue realizado para que funcione en Windows.

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

Si desea ejecutar las pruebas de Jest, deberá ejecutar el siguiente código en la cmd:
```
npm test
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

---
### Configuración local de AWS 

> [!NOTE]
> No es necesario realizar esta configuración en el caso de utilizar archivo `.env`

1. Configurar credenciales en AWS CLI 
```
aws configure
```

Pedirá lo siguiente:
```
AWS Access Key ID [None]: <TU_ACCESS_KEY_ID>
AWS Secret Access Key [None]: <TU_SECRET_ACCESS_KEY>
Default region name [None]: sa-east-1
Default output format [None]: json
```

## Links

- [link de 'AWS DynamoDB for javascript'](https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/programming-with-javascript.html)
- [Operaciones dentro de AWSDynamoBd](https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/workbench.querybuilder.operationbuilder.api.html#workbench.querybuilder.operationbuilder.Put)
- [link Azure](https://learn.microsoft.com/es-mx/azure/app-service/quickstart-nodejs?tabs=windows&pivots=development-environment-vscode)





EC2
Jenkins
