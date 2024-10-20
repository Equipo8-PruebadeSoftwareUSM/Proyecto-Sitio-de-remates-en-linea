const productForm = document.getElementById('productForm');
const productTable = document.querySelector('#productTable tbody');
const updateButton = document.getElementById('updateButton');
let authToken = localStorage.getItem('authToken');

// Add product on form submit
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
  fetchProducts()
  resetForm();
});

// Function to add a product
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

// Function to update a product
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

// Function to fetch products
async function fetchProducts() {
  try {
    const response = await fetch('/api/products', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) throw new Error(`Error fetching products: ${response.status}`);

    const products = await response.json();
    if (!products.length) {
      console.log('No products found');
      return;
    }
    
    productTable.innerHTML = ''; // Clear table
    products.forEach(product => appendProductToTable(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to load products. Please check the console for more details.');
  }
}

function editProduct(productId) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === productId);
  const product = {
    id: productRow.cells[0].innerText,
    nombre: productRow.cells[1].innerText,
    descripcion: productRow.cells[2].innerText,
    categoria: productRow.cells[3].innerText,
    precio_inicial: productRow.cells[4].innerText,
    duracion_remate: productRow.cells[5].innerText,
  };

  // Llenar el formulario con los datos del producto
  document.getElementById('productId').value = product.id;
  document.getElementById('nombre').value = product.nombre;
  document.getElementById('descripcion').value = product.descripcion;
  document.getElementById('categoria').value = product.categoria;
  document.getElementById('precio_inicial').value = product.precio_inicial;
  document.getElementById('duracion_remate').value = product.duracion_remate;

  // Mostrar el botón de actualización
  updateButton.style.display = 'inline-block';
}


// Función para restablecer el formulario después de actualizar o agregar un producto
function resetForm() {
  document.getElementById('productId').value = ''; // Limpiar el campo oculto productId
  productForm.reset(); // Restablecer el formulario
  updateButton.style.display = 'none'; // Ocultar el botón de actualizar
}

// Función para eliminar un producto
async function deleteProduct(productId) {
  const response = await fetch(`/api/products/${productId}`, {headers: {
    'Authorization': `Bearer ${authToken}`
  },
  method: 'DELETE'} );
  if (response.ok) {
    removeProductFromTable(productId); // Eliminar el producto de la tabla sin refrescar la página
  } else {
    console.error('Error al eliminar el producto.');
  }
}

// Function to append a product to the table
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

function removeProductFromTable(productId) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === productId);
  if (productRow) {
    productRow.remove();
  }
}

// Other helper functions (resetForm, updateProductInTable, removeProductFromTable) remain unchanged

// Login functionality
const loginForm = document.getElementById('loginForm');
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
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    
    document.getElementById('loginContainer').style.display = 'none';
    //document.getElementById('loginForm').style.display = 'none'; //Si se incluye esto lanza un mensaje de brecha de seguridad
    document.getElementById('productContainer').style.display = 'block';
    fetchProducts();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your credentials.');
  }
});

// Logout functionality
function logout() {
  localStorage.removeItem('authToken');
  authToken = null;
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('productContainer').style.display = 'none';
}

// Logout button listener
document.getElementById('logoutButton').addEventListener('click', logout);

// On page load, check if token exists
window.addEventListener('load', () => {
  if (authToken) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('productContainer').style.display = 'block';
    fetchProducts();
  }
});

//---------------------------------------------------------

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');
const tableRows = document.querySelectorAll('#productTable tbody tr');

// Evento para buscar producto
searchButton.addEventListener('click', filterTable);

// Evento para cancelar la búsqueda
clearButton.addEventListener('click', clearSearch);

/* 
Filter Table:
--> Recibe la palabra ingresada y convierte todo a minusculas
    para realizar una busqueda más efectiva, luego de eso 
    "oculta" aquellos productos que no tengan contenido similar al buscado
*/
function filterTable() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const tableRows = document.querySelectorAll('#productTable tbody tr');

  tableRows.forEach(row => {
    const nombreCell = row.querySelector('td:nth-child(2)'); 
    // Indice para buscar según los nombres de los productos
    
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

/*
Clear Search:
--> Cancela la búsqueda realizada para volver
    a mostrar todas las filas de productos
    ...
    más o menos hace lo mismo que la función
    anterior, pero con una palabra "vacia"
*/
 function clearSearch() {
  searchInput.value = '';
  const tableRows = document.querySelectorAll('#productTable tbody tr');
  tableRows.forEach(row => {
      row.style.display = '';
  });
}

//---------------------------------------------------------