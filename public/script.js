const productForm = document.getElementById('productForm');
const productTable = document.querySelector('#productTable tbody');

// Cargar productos al cargar la página
window.onload = fetchProducts;

// Agregar o actualizar producto al enviar el formulario
productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const product = Object.fromEntries(formData.entries());

  if (product.id) {
    // Si hay un ID, se actualizará el producto existente
    await updateProduct(product);
  } else {
    // Si no hay ID, se agregará un nuevo producto
    product.id = `Producto-${Date.now()}`; // Genera un ID único
    await addProduct(product);
  }

  productForm.reset();
  fetchProducts();
});

// Función para agregar un producto
async function addProduct(product) {
  const response = await fetch('/api/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    console.error('Error al agregar el producto');
  }
}

// Función para actualizar un producto
async function updateProduct(product) {
  const response = await fetch(`/api/products/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    console.error('Error al actualizar el producto');
  }
}

// Obtener y mostrar productos
async function fetchProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  productTable.innerHTML = '';

  products.forEach(product => {
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
  });
}

// Función para llenar el formulario con los datos del producto seleccionado para editar
function editProduct(productId) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === productId);
  const product = {
    id: productRow.cells[0].innerText,
    nombre: productRow.cells[1].innerText,
    descripcion: productRow.cells[2].innerText,
    categoria: productRow.cells[3].innerText,
    precio_inicial: productRow.cells[4].innerText,
    duracion_remate: productRow.cells[5].innerText,
    imagen_url: productRow.cells[6].querySelector('img').src
  };

  // Llenar el formulario con los datos del producto
  document.getElementById('productId').value = product.id;
  document.getElementById('nombre').value = product.nombre;
  document.getElementById('descripcion').value = product.descripcion;
  document.getElementById('categoria').value = product.categoria;
  document.getElementById('precio_inicial').value = product.precio_inicial;
  document.getElementById('duracion_remate').value = product.duracion_remate;
  document.getElementById('imagen_url').value = product.imagen_url;
}

// Eliminar producto
async function deleteProduct(productId) {
  await fetch(`/api/products/${productId}`, { method: 'DELETE' });
  fetchProducts();
}
