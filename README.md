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


### AWS DynamoDb
2. Instalé el SDK de AWS y se creo la carpeta 'node_modules'
```
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

3. Instalé Winston para logs
```
npm install winston
```


3. Instalé AWS CLI -> Se creó AWSCLI.pkg
```
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

4. Configurar credenciales en AWS CLI
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

5. Instalé 'dotenv' para manejar variables de entorno del archivo '.env'
```
npm install dotenv
```

6. Instalé express 
```
npm install express
```



## Links

(link de 'AWS SDK for Node.js' )[https://www.npmjs.com/package/aws-sdk]
(link Azure)[https://learn.microsoft.com/es-mx/azure/app-service/quickstart-nodejs?tabs=windows&pivots=development-environment-vscode]






## Autores
- Diego Veas
- Carlos Vega
- Pablo Campos
- Luis Zegarra



