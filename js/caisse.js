function productRecipe(productId) {
  return recipes.filter(r => r.product_id === productId);
}

function stockByName(name) {
  return ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
}

function renderProducts() {
  const search = (pizzaSearch?.value || "").toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(search));

  productsGrid.innerHTML = filtered.map(p => {
    const rec = productRecipe(p.id).map(r => r.ingredient_name).slice(0, 4).join(", ");
    return `
      <div class="pizza-card" onclick="addToCart('${p.id}')">
        <div class="pizza-art"></div>
        <h3>${p.name}</h3>
        <div class="ingredients">${rec || "Recette non définie"}</div>
        <div class="price-row"><div class="price">${fmt(p.price)}</div><div class="plus">+</div></div>
      </div>
    `;
  }).join("") || `<div class="card">Aucune pizza créée.</div>`;
}

function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  const found = cart.find(x => x.id === productId);
  if (found) found.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: Number(p.price), qty: 1 });
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart() {
  cartBox.innerHTML = cart.length
    ? cart.map(i => `<div class="cart-line"><span>${i.qty} × ${i.name}</span><strong>${fmt(i.qty * i.price)}</strong></div>`).join("")
    : `<p>Aucune pizza dans la commande.</p>`;

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { ht, tax } = taxFromTTC(total);
  cartTotal.textContent = fmt(total);
  cartTax.textContent = fmt(tax);
  cartHT.textContent = fmt(ht);
}

function neededStock() {
  const needed = {};
  for (const item of cart) {
    for (const r of productRecipe(item.id)) {
      needed[r.ingredient_name] = (needed[r.ingredient_name] || 0) + Number(r.quantity) * item.qty;
    }
  }
  return needed;
}

async function checkout() {
  if (!cart.length) return alert("Panier vide.");
  const needed = neededStock();

  for (const [name, qty] of Object.entries(needed)) {
    const ingredient = stockByName(name);
    if (!ingredient) return alert("Ingrédient manquant : " + name);
    if (Number(ingredient.stock) < qty) return alert(`Stock insuffisant : ${name}`);
  }

  for (const [name, qty] of Object.entries(needed)) {
    const ingredient = stockByName(name);
    const { error } = await db.from("ingredients").update({ stock: Number(ingredient.stock) - qty }).eq("id", ingredient.id);
    if (error) return alert(error.message);
  }

  const rows = cart.map(i => ({ product_name: i.name, quantity: i.qty, total: i.price * i.qty, cashier: currentStaff.discord_name }));
  const { error } = await db.from("sales").insert(rows);
  if (error) return alert(error.message);

  cart = [];
  await loadAll();
  alert("Vente enregistrée.");
}
