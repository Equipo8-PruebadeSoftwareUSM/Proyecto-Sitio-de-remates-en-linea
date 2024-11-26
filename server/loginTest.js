const { Builder, By, Key, until } = require('selenium-webdriver');

// Creación de un delay para mejor visualización
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function testLogin() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Abrir la página de inicio (index.html)
        await driver.get('http://localhost:3000/index.html');
        await delay(1000); // 1 segundo de espera

        // 2. Localizar y rellenar el campo de email
        await driver.findElement(By.id('loginEmail')).sendKeys('user@example.com');
        await delay(1000); // 1 segundo de espera

        // 3. Localizar y rellenar el campo de contraseña
        await driver.findElement(By.id('loginPassword')).sendKeys('userpassword', Key.RETURN);
        await delay(1000); // 1 segundo de espera

        // 4 .Esperar a que la página cargue un elemento de la siguiente página
        await driver.wait(until.elementLocated(By.id('productContainer')), 10000);
        await delay(1000); // 1 segundo de espera

        console.log('Prueba de inicio de sesión exitosa');
    } catch (err) {
        console.error(`Error en la prueba de login: ${err}`);
    } finally {
        await delay(1000); // 1 segundo de espera
        await driver.quit();
    }
})();
