const { Builder, By, Key, until } = require('selenium-webdriver');

// Creación de un delay para mejor visualización
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function testCycle() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        //------------------------------------------------------------------------------------------------------------------------
        // 1. Abrir la página de inicio (index.html)
        await driver.get('http://localhost:3000/index.html');
        //------------------------------------------------------------------------------------------------------------------------
        // 2. Ingresar credenciales en el formulario de ingreso al sitio
        await delay(1000);
        await driver.findElement(By.id('loginEmail')).sendKeys('user@example.com');
        await delay(1000);
        await driver.findElement(By.id('loginPassword')).sendKeys('userpassword', Key.RETURN);
        await delay(1000);
        //------------------------------------------------------------------------------------------------------------------------
        // 3. Validar que estamos en la página de productos en base a la url
        await driver.wait(until.urlContains('products.html'), 10000);
        await delay(1000);
        console.log('Login exitoso y redireccionado a products.html');
        //------------------------------------------------------------------------------------------------------------------------
        // 4. Agregar un elemento de prueba con el formulario para agregar productos
        const productName = 'Producto de Prueba';
        await driver.findElement(By.id('nombre')).sendKeys(productName);
        await delay(1000);
        await driver.findElement(By.id('descripcion')).sendKeys('Descripción del producto de prueba');
        await delay(1000);
        await driver.findElement(By.id('categoria')).sendKeys('Electrónica');
        await delay(1000);
        await driver.findElement(By.id('precio_inicial')).sendKeys('1500');
        await delay(1000);
        await driver.findElement(By.id('duracion_remate')).sendKeys('31-12-2024'); // Fecha '2024-12-31' funciona, pero no como se espera
        await delay(1000);
        await driver.findElement(By.css('button[type="submit"]')).click();
        await delay(1500);
        console.log('Producto enviado para agregar');
        //------------------------------------------------------------------------------------------------------------------------
        // 5. Verificar si el producto de prueba aparece en el catálogo
        await driver.wait(until.elementLocated(By.id('productTable')), 10000);
        const productRows = await driver.findElements(By.css('#productTable tbody tr'));
        if (productRows.length > 0) {
            console.log('El producto fue agregado correctamente');
        } else {
            throw new Error('El producto no fue agregado');
        }
        await delay(2000);
        //------------------------------------------------------------------------------------------------------------------------
        // 6. Eliminar el producto de prueba añadido
        await delay(1000);
        const productRow = await driver.findElement(By.xpath(`//tr[td[text()="${productName}"]]`));
        await driver.executeScript("arguments[0].scrollIntoView(true);", productRow); // Asegurar que el producto esté en vista
        const deleteButton = await driver.findElement(By.xpath(`//tr[td[text()="${productName}"]]//button[text()="Eliminar"]`));
        await delay(3000);
        await driver.wait(until.elementIsVisible(deleteButton), 5000);
        await deleteButton.click();
        await delay(1000);
        console.log('El producto fue eliminado correctamente');
        //------------------------------------------------------------------------------------------------------------------------
        // 7. Testear el botón para cerrar sesión exitosamente
        const logoutButton = await driver.findElement(By.id('logoutButton'));
        await delay(2000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", logoutButton);
        await delay(2000);
        await driver.wait(until.elementIsVisible(logoutButton), 5000);
        await logoutButton.click();
        await delay(1000);
        console.log('Cierre de sesión exitoso');
        //------------------------------------------------------------------------------------------------------------------------
        console.log('Prueba creación y eliminación de producto, exitosa');
    } catch (error) {
        console.error('Error durante la prueba:', error);
    } finally {
        // 8. Cerrar el navegador
        await delay(1000);
        await driver.quit();
    }
})();
