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
        await delay(500);
        await driver.findElement(By.id('descripcion')).sendKeys('Descripción del producto de prueba');
        await delay(500);
        await driver.findElement(By.id('categoria')).sendKeys('Electrónica');
        await delay(500);
        await driver.findElement(By.id('precio_inicial')).sendKeys('1500');
        await delay(500);
        await driver.findElement(By.id('duracion_remate')).sendKeys('31-12-2024');
        await delay(500);
        await driver.findElement(By.css('button[type="submit"]')).click();
        await delay(1000);
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
        // 6. Acceder a la página de detalle del producto de prueba
        const detailButtonXPath = `//tr[td[text()="${productName}"]]//button[contains(text(), "Ver Detalle")]`;
        const detailButton = await driver.findElement(By.xpath(detailButtonXPath));
        if (!detailButton) {
            throw new Error('Botón de "Ver Detalle" no encontrado en la tabla.');
        }
        await driver.executeScript("arguments[0].scrollIntoView(true);", detailButton);
        await driver.wait(until.elementIsVisible(detailButton), 5000);
        await delay(2000);

        try {
            await driver.executeScript("arguments[0].click();", detailButton); // Forzar click de botón con JavaScript
            console.log('Clic en el botón de detalle forzado con éxito');
        } catch (error) {
            console.error('Error al forzar el clic en el botón de detalle:', error);
            throw new Error('No se pudo hacer clic en el botón de detalle, incluso con JavaScript');
        }
        await delay(1000);
        await driver.wait(until.urlContains('detalle_producto.html'), 10000);
        console.log('Navegación a la página de detalle del producto exitosa');

        await driver.wait(until.elementLocated(By.id('productId')), 5000);
        const detailName = await driver.findElement(By.id('productName')).getText();
        if (detailName === productName) {
            console.log('La información del producto en la página de detalles es correcta');
        } else {
            throw new Error('Los detalles del producto no coinciden');
        }
        //------------------------------------------------------------------------------------------------------------------------
        // 7. Ofertar en el remate
        const currentUrl = await driver.getCurrentUrl();
        console.log('URL actual:', currentUrl);
        if (!currentUrl.includes('detalle_producto.html')) {
            throw new Error('No estamos en la página de detalle del producto');
        }
        await delay(1000);

        const offerButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), "Ofertar en el Remate")]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", offerButton);
        await delay(500);
        await driver.wait(until.elementIsVisible(offerButton), 5000);
        await offerButton.click();
        console.log('Botón de "Ofertar en el Remate" presionado');
        await delay(500);

        const modal = await driver.wait(until.elementLocated(By.id('editPriceModal')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        console.log('Modal de oferta visible');
        await delay(1000);

        const priceInput = await driver.findElement(By.id('newPrice'));
        await priceInput.clear();
        await priceInput.sendKeys('2000'); //Nuevo precio a ingresar, valor original de 1500
        console.log('Nuevo precio ingresado: 2000');
        await delay(1000);

        const submitOfferButton = await driver.findElement(By.xpath(`//button[contains(text(), "Realizar Oferta")]`));
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitOfferButton);
        await driver.wait(until.elementIsVisible(submitOfferButton), 5000);
        await submitOfferButton.click();
        await delay(1000);
        console.log('Oferta realizada');

        try {
            const alert = await driver.wait(until.alertIsPresent(), 5000); // Esperar a que la alerta esté presente
            const alertText = await alert.getText(); // Obtener el texto de la alerta
            console.log(`Texto de la alerta: ${alertText}`);
            await delay(2000); // Esperar un poco más antes de aceptar
            await alert.accept(); // Aceptar la alerta
            console.log('Alerta aceptada');
            await delay(2000); // Esperar después de aceptar la alerta
        } catch (error) {
            console.error('No se encontró ninguna alerta:', error);
        }

        const updatedPrice = await driver.findElement(By.id('productPrice')).getText();
        if (updatedPrice === '2000') {
            console.log('El precio del producto fue actualizado correctamente a 2000');
        } else {
            throw new Error(`El precio del producto no se actualizó correctamente. Precio actual: ${updatedPrice}`);
        }
        //------------------------------------------------------------------------------------------------------------------------
        // 6.2 Regresar desde la página de detalles al catálogo principal
        await delay(2000);
        const backButton = await driver.findElement(By.css('a.btn-primary'));
        await driver.executeScript("arguments[0].scrollIntoView(true);", backButton); // Asegurarse de que el botón esté visible
        await driver.wait(until.elementIsVisible(backButton), 5000);
        await driver.executeScript("arguments[0].click();", backButton); // Forzar clic en el botón de regreso
        await driver.wait(until.urlContains('products.html'), 10000);
        console.log('Regreso a la página de productos exitoso');
        //------------------------------------------------------------------------------------------------------------------------
        // 8. Eliminar el producto de prueba añadido
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
        // 9. Testear el botón para cerrar sesión exitosamente
        const logoutButton = await driver.findElement(By.id('logoutButton'));
        await delay(2000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", logoutButton);
        await delay(2000);
        await driver.wait(until.elementIsVisible(logoutButton), 5000);
        await logoutButton.click();
        await delay(1000);
        console.log('Cierre de sesión exitoso');
        //------------------------------------------------------------------------------------------------------------------------
        console.log('Prueba participando de un remate valido, exitosa');
    } catch (error) {
        console.error('Error durante la prueba:', error);
    } finally {
        // 10. Cerrar el navegador
        await delay(1000);
        await driver.quit();
    }
})();