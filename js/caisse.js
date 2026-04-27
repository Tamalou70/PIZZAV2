function productRecipe(productId) {
  return recipes.filter(r => r.product_id === productId);
}

function stockByName(name) {
  return ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
}

function pizzaImageHtml(p) {
  if (p.image_url && p.image_url.trim()) {
    return `
      <img class="pizza-photo" src="${p.image_url}" alt="${p.name}"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
      <div class="pizza-art hidden-fallback"></div>
    `;
  }
  return `<div class="pizza-art"></div>`;
}

function renderProducts() {
  productsGrid.innerHTML = products.map(p => {
    return `
      <div class="pizza-card" onclick="addToCart('${p.id}')">
        ${pizzaImageHtml(p)}
        <h3>${p.name}</h3>
        <div class="price-row">
          <div class="price">${fmt(p.price)}</div>
          <div class="plus">+</div>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const found = cart.find(x => x.id === id);

  if (found) found.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });

  renderCart();
}

function renderCart() {
  cartBox.innerHTML = cart.map(i =>
    `<div class="cart-line">
      <span>${i.qty} × ${i.name}</span>
      <strong>${fmt(i.qty * i.price)}</strong>
    </div>`
  ).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ht = total / 1.3;
  const tva = total - ht;

  cartTotal.textContent = fmt(total);
  cartHT.textContent = fmt(ht);
  cartTax.textContent = fmt(tva);
}
