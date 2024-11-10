let authToken = localStorage.getItem('authToken');

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Funcionalidad de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      authToken = data.token;
      
      // Redirigir a la página de productos
      window.location.href = 'products.html';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Login failed. Please check your credentials.');
    }
  });
}

// Verificar autenticación en products.html
if (!authToken && window.location.pathname.endsWith('products.html')) {
  window.location.href = 'index.html';
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Funcionalidad de Logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Función para cargar productos
async function fetchProducts() {
  try {
    const response = await fetch('/api/products', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) throw new Error(`Error fetching products: ${response.status}`);

    const products = await response.json();
    productTable.innerHTML = ''; // Clear table
    products.forEach(product => appendProductToTable(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to load products. Please check the console for more details.');
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Función de búsqueda
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');

if (searchButton) {
  searchButton.addEventListener('click', filterTable);
}
if (clearButton) {
  clearButton.addEventListener('click', clearSearch);
}

function filterTable() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const tableRows = document.querySelectorAll('#productTable tbody tr');

  tableRows.forEach(row => {
    const nombreCell = row.querySelector('td:nth-child(2)'); // Asume que el nombre está en la segunda columna
    
    if (nombreCell) {
      const nombreText = nombreCell.textContent.trim().toLowerCase();
      
      if (nombreText.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
}

function clearSearch() {
  searchInput.value = '';
  const tableRows = document.querySelectorAll('#productTable tbody tr');
  tableRows.forEach(row => {
    row.style.display = '';
  });
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Funcionalidad para agregar, actualizar y mostrar productos
const productForm = document.getElementById('productForm');
const productTable = document.querySelector('#productTable tbody');
const updateButton = document.getElementById('updateButton');

if (productForm) {
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);

    const productId = document.getElementById('productId').value;
    if (productId) {
      await updateProduct(formData); // Make sure formData is correctly structured
    } else {
      const newId = `Producto-${Date.now()}`;
      formData.set('id', newId);
      await addProduct(formData);
    }
    fetchProducts();
    resetForm();
  });
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Funcion para añadir un producto
async function addProduct(formData) {
  try {
    const response = await fetch('/api/products/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Error adding product');
    const newProduct = await response.json();
    appendProductToTable(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Función para actualizar un producto
async function updateProduct(formData) {
  try {
    const response = await fetch(`/api/products/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData
    });
    if (!response.ok) throw new Error('Error updating product');
    const updatedProduct = await response.json();
    updateProductInTable(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Funciones de ayuda para manipular la tabla de productos
function appendProductToTable(product) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${product.id}</td>
    <td>${product.nombre}</td>
    <td>${product.descripcion}</td>
    <td>${product.categoria}</td>
    <td>${product.precio_inicial}</td>
    <td>${product.duracion_remate}</td>
    <td><img src="${product.imagen_url}" alt="${product.nombre}" width="100"></td>
    <td>
      <button onclick="editProduct('${product.id}')">Editar</button>
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
      <button onclick="window.location.href='detalle_producto.html?id=${product.id}'; fetchproductDetail(${product.id})">Ver Detalle</button>
    </td>
  `;
  productTable.appendChild(row);
}

function updateProductInTable(product) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === product.id);
  if (productRow) {
    productRow.cells[1].innerText = product.nombre;
    productRow.cells[2].innerText = product.descripcion;
    productRow.cells[3].innerText = product.categoria;
    productRow.cells[4].innerText = product.precio_inicial;
    productRow.cells[5].innerText = product.duracion_remate;
    productRow.cells[6].innerHTML = `<img src="${product.imagen_url}" alt="${product.nombre}" width="100">`;
  }
}

function editProduct(productId) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === productId);
  document.getElementById('productId').value = productRow.cells[0].innerText;
  document.getElementById('nombre').value = productRow.cells[1].innerText;
  document.getElementById('descripcion').value = productRow.cells[2].innerText;
  document.getElementById('categoria').value = productRow.cells[3].innerText;
  document.getElementById('precio_inicial').value = productRow.cells[4].innerText;
  document.getElementById('duracion_remate').value = productRow.cells[5].innerText;
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Función para eliminar un producto
async function deleteProduct(productId) {
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    fetchProducts();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

// Evento para cargar productos al cargar la página de products.html
if (window.location.pathname.endsWith('products.html') && authToken) {
  fetchProducts();
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------


async function fetchProductDetail(productId) {

  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get('id');

  try {

    const response = await fetch(`/api/products`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!response.ok) throw new Error('Error al obtener el detalle del producto');

    
    const product = (await response.json()).find(p => p.id === productoId);


    // Llenar los campos de la página con los datos del producto
    document.getElementById('productId').innerText = productoId;
    document.getElementById('productName').innerText = product.nombre;
    document.getElementById('productDescription').innerText = product.descripcion;
    document.getElementById('productCategory').innerText = product.categoria;
    document.getElementById('productPrice').innerText = product.precio_inicial;
    document.getElementById('productDuration').innerText = product.duracion_remate;
    document.getElementById('productImage').src = product.imagen_url || 'path_to_placeholder_image.jpg';
        
  } catch (error) {
    console.error('Error al cargar el detalle del producto:', error);
    alert('No se pudo cargar el producto. Intenta nuevamente.');
  }
}

fetchProductDetail();

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

// Mostrar el modal para editar el precio
document.getElementById('editPriceButton').addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('editPriceModal'));
  modal.show();
});

// Función para actualizar el precio
async function updateProductPrice() {

  //---------------------------------------------------------------------------------------------

  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get('id');

  const response = await fetch(`/api/products`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  if (!response.ok) throw new Error('Error al obtener el detalle del producto');

  const product = (await response.json()).find(p => p.id === productoId);

  const nombreP = document.getElementById('productName').innerText = product.nombre;
  const descripcionP = document.getElementById('productDescription').innerText = product.descripcion;
  const categoriaP = document.getElementById('productCategory').innerText = product.categoria;
  const duracionP = document.getElementById('productDuration').innerText = product.duracion_remate;
  const imagenP = document.getElementById('productImage').src = product.imagen_url || 'path_to_placeholder_image.jpg';

  let originalPrice = 0;  // Variable para almacenar el precio original
  originalPrice = product.precio_inicial;
  const newPrice = document.getElementById('newPrice').value;

  //---------------------------------------------------------------------------------------------

  // Validar si el precio ingresado es mayor o igual al precio original
  if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
    alert('Por favor, ingresa un precio válido.');
    return;
  }

  if (newPrice < originalPrice) {
    alert(`El nuevo precio no puede ser menor al precio original (${originalPrice}).`);
    return;
  }

  //---------------------------------------------------------------------------------------------

  try {
    const response = await fetch(`/api/products/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: productoId, nombre: nombreP, descripcion: descripcionP, categoria: categoriaP, precio_inicial: newPrice, duracion_remate: duracionP, imagen_url: imagenP })
    });
  
    if (!response.ok) throw new Error('Error al actualizar el precio');
    const updatedProduct = await response.json();
  
    // Actualizar el precio en la página web
    fetchProductDetail();
  
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPriceModal'));
    modal.hide();
  
    alert('Precio actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el precio:', error);
    alert('No se pudo actualizar el precio. Intenta nuevamente.');
  }
  
}
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('sendEmailButton').addEventListener('click', function() {
  var emailParams = {
    to_name: "sebaszegarra@gmail.com",  // Dirección del destinatario
    from_name: "rincondelolvido@outlook.com",
    message: "Gracias por participar en nuestro remate. ¡Buena suerte!"
  };

  emailjs.send('outlook', 'template_0x6kaaa', emailParams)
  .then(function(response) {
    console.log(response);
    alert('Correo enviado con éxito!');
  }, function(error) {
    console.log(error);
    alert('Error al enviar el correo');
  });
  
});