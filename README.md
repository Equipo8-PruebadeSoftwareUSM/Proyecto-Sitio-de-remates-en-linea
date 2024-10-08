# Equipo 8 Proyecto-Sitio-de-remates-en-linea
Proyecto para ramo Prueba de Software de la Universidad Federico Santa Maria.

Herramienta de testing: Mocha(Chai)
Tecnologías a usar en el proyecto: ReactJS (Front-end) + NodeJS(Back-end) + AWS

## Instrucciones

1. Verificar si esta instalado npm y node
```
node -v
```
```
npm -v
```

2. Installar dependencias

3. Ejecutar servidor
```
node server/server.js
```

luego ir a localhost
```
http://localhost:8002
```

### Installar dependencias
1. Instalé el SDK de AWS y se creo la carpeta 'node_modules'
```
npm install express body-parser @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb multer winston dotenv 

```
- express
- body-parser 
- @aws-sdk/client-dynamodb 
- @aws-sdk/lib-dynamodb
- *dotenv*: para cargar el .env
- *winston*: para logs
- multer: manejo de archivos en imagenes 


### Configuración local de AWS (no es necesaria hacerla, estamos ocupando el .env)
1. Configurar credenciales en AWS CLI (no es necesario, porque se tiene el .env)
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

## Estructura del Prouyecto

```
.
├── LICENSE
├── README.md
├── logs ----------------- (se guardan los logs de errores e informacion)
│   ├── error.log
│   └── server.log
├── node_modules         
├── package-lock.json
├── package.json
├── public --------------- (interfaz web)
│   ├── index.html
│   ├── images
│   ├── script.js
│   └── styles.css
└── server --------------- (backend)
    ├── config
    ├── logger.js
    ├── routes
    ├── server.js
    └── services

```

## Links

(link de 'AWS DynamoDB for javascript')[https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/programming-with-javascript.html]
(Operaciones dentro de AWSDynamoBd)[https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/workbench.querybuilder.operationbuilder.api.html#workbench.querybuilder.operationbuilder.Put]
(link Azure)[https://learn.microsoft.com/es-mx/azure/app-service/quickstart-nodejs?tabs=windows&pivots=development-environment-vscode]



## Autores
- Diego Veas
- Carlos Vega
- Pablo Campos
- Luis Zegarra



