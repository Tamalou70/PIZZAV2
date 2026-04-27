function productRecipe(productId) {
  return recipes.filter(r => r.product_id === productId);
}

function stockByName(name) {
  return ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
}

function pizzaImageHtml(p) {
  const url = (p.image_url || "").trim();

  if (url) {
    return `<img class="pizza-img" src="${url}" alt="${p.name}" loading="lazy" onerror="this.replaceWith(document.createElement('div')); this.className='pizza-art';">`;
  }

  return `<div class="pizza-art"></div>`;
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(p => `
      <div class="pizza-card" onclick="addToCart(${p.id})">
        ${pizzaImageHtml(p)}

        <div class="pizza-title">${p.name}</div>
        <div class="ingredients">
          ${productRecipe(p.id).map(r => r.ingredient_name).join(", ")}
        </div>

        <div class="price-row">
          <div class="price">${fmt(p.price)}</div>
          <div class="plus">+</div>
        </div>
      </div>
    `)
    .join("");
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const found = cart.find(x => x.id === id);
  if (found) found.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });

  renderCart();
}

function renderCart() {
  cartBox.innerHTML = cart
    .map(i => `
      <div class="cart-line">
        <span>${i.qty} × ${i.name}</span>
        <strong>${fmt(i.qty * i.price)}</strong>
      </div>
    `)
    .join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ht = total / 1.3;
  const tva = total - ht;

  cartTotal.textContent = fmt(total);
  cartHT.textContent = fmt(ht);
  cartTax.textContent = fmt(tva);
}
