const { Builder, By, Key, until } = require('selenium-webdriver');

// Creación de un delay para mejor visualización
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function testCycle() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Abrir la página de inicio (index.html)
        await driver.get('http://localhost:3000/index.html'); // Cambia a la URL de tu proyecto

        // 2. Ingresar credenciales en el formulario de ingreso al sitio
        await driver.findElement(By.id('loginEmail')).sendKeys('user@example.com');
        await delay(1000); // 1 segundo de espera
        await driver.findElement(By.id('loginPassword')).sendKeys('userpassword', Key.RETURN);
        await delay(1000); // 1 segundo de espera

        // 4 .Esperar a que la página cargue un elemento de la siguiente página
        await driver.wait(until.urlContains('products.html'), 10000);
        await delay(1000); // 1 segundo de espera
        console.log('Login exitoso y redireccionado a products.html');
        await delay(1000); // 1 segundo de espera

        // 4. Validar que estamos en la página de productos
        let pageTitle = await driver.getTitle();
        await delay(1000); // 1 segundo de espera
        if (pageTitle === 'Gestión de Productos - El Rincón del Olvido') {
            console.log('Página de productos cargada correctamente');
        } else {
            throw new Error('No se cargó la página de productos');
        }

        // 5. Probar el formulario de agregar productos
        await driver.findElement(By.id('nombre')).sendKeys('Producto de Prueba');
        await delay(1000); // 1 segundo de espera
        await driver.findElement(By.id('descripcion')).sendKeys('Descripción del producto de prueba');
        await delay(1000); // 1 segundo de espera
        await driver.findElement(By.id('categoria')).sendKeys('Electrónica');
        await delay(1000); // 1 segundo de espera
        await driver.findElement(By.id('precio_inicial')).sendKeys('1500');
        await delay(1000); // 1 segundo de espera
        await driver.findElement(By.id('duracion_remate')).sendKeys('2024-12-31');
        await delay(1000); // 1 segundo de espera
        

        // 6. Hacer clic en el botón para agregar/actualizar
        await driver.findElement(By.css('button[type="submit"]')).click();
        await delay(1000); // 1 segundo de espera
        console.log('Producto enviado para agregar/actualizar');

        // 7. Verificar si el producto aparece en la tabla
        await driver.wait(until.elementLocated(By.id('productTable')), 10000);
        await delay(1000); // 1 segundo de espera
        let productRows = await driver.findElements(By.css('#productTable tbody tr'));
        if (productRows.length > 0) {
            console.log('El producto fue agregado correctamente');
        } else {
            console.error('El producto no fue agregado');
        }


        // 7. Probar el botón de cerrar sesión
        await driver.findElement(By.id('logoutButton')).click();
        await delay(1000); // 1 segundo de espera
        await driver.wait(until.urlContains('index.html'), 10000);
        await delay(1000); // 1 segundo de espera
        console.log('Cierre de sesión exitoso');

    } catch (error) {
        console.error('Error durante la prueba:', error);
    } finally {
        // 8. Cerrar el navegador
        await delay(1000); // 1 segundo de espera
        await driver.quit();
    }
})();
//AL TERMINAR ESTA PRUEBA, EL PRODUCTO NO SE ELIMINA AUTOMATICAMENTE DE LA BASE DE DATOS!!


