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
    await updateProduct(formData); // Update existing product
  } else {
    const newId = `Producto-${Date.now()}`;
    formData.set('id', newId);
    await addProduct(formData); // Add new product
  }
  resetForm();
});

// Function to add a product
async function addProduct(formData) {
  try {
    const response = await fetch('/api/products/add', {
      method: 'POST',
      body: formData
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
