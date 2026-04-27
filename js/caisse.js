function productRecipe(productId) {
  return recipes.filter(r => String(r.product_id) === String(productId));
}

function stockByName(name) {
  return ingredients.find(i => String(i.name).toLowerCase() === String(name).toLowerCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pizzaImageHtml(p) {
  const url = String(p.image_url || "").trim();

  if (url) {
    return `
      <img class="pizza-img pizza-photo" src="${escapeHtml(url)}" alt="${escapeHtml(p.name)}" loading="lazy"
        onerror="this.style.display='none'; const fallback=this.nextElementSibling; if(fallback) fallback.classList.remove('hidden');" />
      <div class="pizza-art hidden"></div>
    `;
  }

  return `<div class="pizza-art"></div>`;
}

function renderProducts() {
  if (!productsGrid) return;

  const search = (pizzaSearch?.value || "").trim().toLowerCase();
  const filteredProducts = products.filter(p =>
    !search || String(p.name || "").toLowerCase().includes(search)
  );

  productsGrid.innerHTML = filteredProducts.map(p => `
    <div class="pizza-card" onclick="addToCart('${String(p.id).replaceAll("'", "\\'")}')">
      ${pizzaImageHtml(p)}
      <h3>${escapeHtml(p.name)}</h3>
      <div class="price-row">
        <div class="price">${fmt(p.price)}</div>
        <div class="plus">+</div>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  const p = products.find(x => String(x.id) === String(id));
  if (!p) {
    alert("Pizza introuvable. Recharge la page avec Ctrl + F5.");
    return;
  }

  const found = cart.find(x => String(x.id) === String(id));
  if (found) found.qty++;
  else cart.push({ id: p.id, name: p.name, price: Number(p.price || 0), qty: 1 });

  renderCart();
}

function renderCart() {
  if (!cartBox) return;

  cartBox.innerHTML = cart.map(i => `
    <div class="cart-line">
      <span>${i.qty} × ${escapeHtml(i.name)}</span>
      <strong>${fmt(i.qty * i.price)}</strong>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 0), 0);
  const ht = total / 1.3;
  const tva = total - ht;

  cartTotal.textContent = fmt(total);
  cartHT.textContent = fmt(ht);
  cartTax.textContent = fmt(tva);
}

function clearCart() {
  cart = [];
  renderCart();
}

async function checkout() {
  if (!cart.length) {
    alert("Commande vide");
    return;
  }

  const total = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || 0), 0);
  const { ht, tax } = taxFromTTC(total);

  const { error } = await db.from("sales").insert({
    total,
    ht,
    tax,
    items: cart
  });

  if (error) {
    alert("Erreur encaissement : " + error.message);
    return;
  }

  alert("Commande encaissée");
  cart = [];
  await loadAll();
}
