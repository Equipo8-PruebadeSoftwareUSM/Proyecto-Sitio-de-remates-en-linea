let authToken = localStorage.getItem('authToken');

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

// Funcionalidad de Logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
  });
}

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
