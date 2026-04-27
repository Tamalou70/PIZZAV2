let recipeBuilder = [];

function refreshIngredients() {
  recipeIngredientSelect.innerHTML =
    ingredients.map(i => `<option value="${i.name}">${i.name}</option>`).join("");
}

function addRecipeLine() {
  const ing = recipeIngredientSelect.value;
  const qty = Number(recipeQuantityInput.value);

  if (!ing || !qty) return alert("Erreur");

  recipeBuilder.push({ ingredient_name: ing, quantity: qty });
  renderRecipe();
}

function renderRecipe() {
  recipeBuilderList.innerHTML = recipeBuilder.map(r => `
    <div class="badge">
      ${r.ingredient_name} x${r.quantity}
    </div>
  `).join("");
}

async function savePizza() {
  const name = pizzaName.value;
  const price = Number(pizzaPrice.value);
  const image_url = pizzaImageUrl.value;

  if (!name || !price) return alert("Erreur");

  const { data } = await db.from("products")
    .insert({ name, price, image_url })
    .select().single();

  const rows = recipeBuilder.map(r => ({
    product_id: data.id,
    ingredient_name: r.ingredient_name,
    quantity: r.quantity
  }));

  await db.from("recipes").insert(rows);

  alert("Pizza créée");
  recipeBuilder = [];
  loadAll();
}

function renderAdminProducts() {
  refreshIngredients();

  adminProducts.innerHTML = products.map(p => `
    <div class="card">
      ${p.image_url ? `<img src="${p.image_url}" class="admin-pizza-photo">` : ""}
      <h3>${p.name}</h3>
      <p>${fmt(p.price)}</p>
    </div>
  `).join("");
}
