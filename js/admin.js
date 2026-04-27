let recipeBuilder = [];

function refreshIngredients() {
  if (!recipeIngredientSelect) return;

  recipeIngredientSelect.innerHTML = ingredients
    .map(i => `<option value="${escapeHtml(i.name)}">${escapeHtml(i.name)}</option>`)
    .join("");
}

function addRecipeLine() {
  const ing = recipeIngredientSelect.value;
  const qty = Number(recipeQuantityInput.value);

  if (!ing || !qty) return alert("Erreur");

  recipeBuilder.push({ ingredient_name: ing, quantity: qty });
  recipeQuantityInput.value = "";
  renderRecipe();
}

function renderRecipe() {
  if (!recipeBuilderList) return;

  recipeBuilderList.innerHTML = recipeBuilder
    .map((r, index) => `
      <div class="badge">
        ${escapeHtml(r.ingredient_name)} x${r.quantity}
        <button type="button" onclick="removeRecipeLine(${index})">×</button>
      </div>
    `)
    .join("");
}

function removeRecipeLine(index) {
  recipeBuilder.splice(index, 1);
  renderRecipe();
}

async function savePizza() {
  const name = pizzaName.value.trim();
  const price = Number(pizzaPrice.value);
  const image_url = pizzaImageUrl.value.trim();

  if (!name || !price) return alert("Erreur");

  const { data, error } = await db
    .from("products")
    .insert({ name, price, image_url })
    .select()
    .single();

  if (error) return alert(error.message);

  if (recipeBuilder.length) {
    const rows = recipeBuilder.map(r => ({
      product_id: data.id,
      ingredient_name: r.ingredient_name,
      quantity: r.quantity
    }));

    const recipeError = await db.from("recipes").insert(rows);
    if (recipeError.error) return alert(recipeError.error.message);
  }

  alert("Pizza créée");

  pizzaName.value = "";
  pizzaPrice.value = "";
  pizzaImageUrl.value = "";
  recipeBuilder = [];
  renderRecipe();

  await loadAll();
}

function adminPizzaMediaHtml(p) {
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

function renderAdminProducts() {
  if (!adminProducts) return;

  refreshIngredients();

  adminProducts.innerHTML = products
    .map(p => `
      <div class="pizza-card admin-pizza-card">
        ${adminPizzaMediaHtml(p)}
        <div class="pizza-title">${escapeHtml(p.name)}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="actions admin-actions">
          <button type="button" class="danger-btn" onclick="deletePizza('${String(p.id).replaceAll("'", "\\'")}')">Supprimer</button>
        </div>
      </div>
    `)
    .join("");
}

async function deletePizza(id) {
  const pizza = products.find(p => String(p.id) === String(id));
  const name = pizza ? pizza.name : "cette pizza";

  if (!confirm(`Supprimer ${name} ?`)) return;

  await db.from("recipes").delete().eq("product_id", id);

  const { error } = await db.from("products").delete().eq("id", id);
  if (error) return alert(error.message);

  await loadAll();
}
