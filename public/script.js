const productForm = document.getElementById('productForm');
const productTable = document.querySelector('#productTable tbody');
const updateButton = document.getElementById('updateButton');

// Cargar productos al cargar la página
window.onload = fetchProducts;

// Agregar producto al enviar el formulario
productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm); // Crea un FormData para enviar los datos del formulario

  const productId = document.getElementById('productId').value;
  if (productId) {
    // Si hay un ID, se actualizará el producto existente
    await updateProduct(formData);
    resetForm();
  } else {
    // Si no hay ID, se agregará un nuevo producto
    const newId = `Producto-${Date.now()}`; // Genera un ID único
    formData.set('id', newId); // Asegúrate de que el ID sea un string
    await addProduct(formData);
  }
});

// Función para agregar un producto
async function addProduct(formData) {
  const response = await fetch('/api/products/add', {
    method: 'POST',
    body: formData, // Envío de FormData que incluye el archivo
  });

  if (response.ok) {
    const newProduct = await response.json(); // Obtener el nuevo producto agregado
    appendProductToTable(newProduct); // Actualizar la tabla dinámicamente
  } else {
    const errorData = await response.json(); // Obtiene el mensaje de error
    console.error('Error al agregar el producto:', errorData);
  }
}

// Función para actualizar un producto
async function updateProduct(formData) {
  const response = await fetch(`/api/products/update`, {
    method: 'PUT',
    body: formData, // Envío de FormData que incluye el archivo
  });

  if (response.ok) {
    const updatedProduct = await response.json(); // Obtener el producto actualizado
    updateProductInTable(updatedProduct); // Actualizar la tabla dinámicamente
  } else {
    const errorData = await response.json(); // Obtiene el mensaje de error
    console.error('Error al actualizar el producto:', errorData);
  }
}

// Obtener y mostrar productos
async function fetchProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  productTable.innerHTML = ''; // Limpiar la tabla

  products.forEach(product => {
    appendProductToTable(product); // Llenar la tabla con los productos
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
  const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
  if (response.ok) {
    removeProductFromTable(productId); // Eliminar el producto de la tabla sin refrescar la página
  } else {
    console.error('Error al eliminar el producto.');
  }
}

// Función para agregar un producto nuevo a la tabla
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

// Función para actualizar un producto en la tabla
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

// Función para eliminar un producto de la tabla
function removeProductFromTable(productId) {
  const productRow = Array.from(productTable.rows).find(row => row.cells[0].innerText === productId);
  if (productRow) {
    productRow.remove();
  }
}
