function recipeToText(productId) {
  return productRecipe(productId).map(r => `${r.ingredient_name}:${r.quantity}`).join(",");
}

function parseRecipe(recipeRaw) {
  return recipeRaw.split(",").map(part => {
    const [ingredientRaw, qtyRaw] = part.split(":");
    return { ingredient_name: normalizeName(ingredientRaw || ""), quantity: Number(qtyRaw || 0) };
  }).filter(r => r.ingredient_name && r.quantity > 0);
}

async function ensureIngredients(recipeRows) {
  for (const row of recipeRows) {
    if (!stockByName(row.ingredient_name)) {
      const { error } = await db.from("ingredients").insert({ name: row.ingredient_name, stock: 0, min_stock: 10 });
      if (error) throw error;
    }
  }
}

async function savePizza() {
  if (!isPatron()) return alert("Accès direction uniquement.");

  const id = editingPizzaId.value;
  const name = pizzaName.value.trim();
  const price = Number(pizzaPrice.value || 0);
  const recipeRaw = pizzaRecipe.value.trim();
  if (!name || !price || !recipeRaw) return alert("Nom, prix et recette obligatoires.");

  const recipeRows = parseRecipe(recipeRaw);

  try {
    await ensureIngredients(recipeRows);
    let productId = id;

    if (id) {
      const { error } = await db.from("products").update({ name, price }).eq("id", id);
      if (error) throw error;
      await db.from("recipes").delete().eq("product_id", id);
    } else {
      const { data: product, error } = await db.from("products").insert({ name, price }).select().single();
      if (error) throw error;
      productId = product.id;
    }

    const rows = recipeRows.map(r => ({ product_id: productId, ingredient_name: r.ingredient_name, quantity: r.quantity }));
    const { error: recipeError } = await db.from("recipes").insert(rows);
    if (recipeError) throw recipeError;

    resetPizzaForm();
    await loadAll();
    alert(id ? "Pizza modifiée." : "Pizza créée.");
  } catch (e) {
    alert("Erreur : " + e.message);
  }
}

function editPizza(productId) {
  const p = products.find(x => x.id === productId);
  editingPizzaId.value = p.id;
  pizzaName.value = p.name;
  pizzaPrice.value = p.price;
  pizzaRecipe.value = recipeToText(p.id);
  pizzaFormTitle.textContent = "Modifier une pizza";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deletePizza(productId) {
  if (!isPatron()) return alert("Accès direction uniquement.");
  const p = products.find(x => x.id === productId);
  if (!confirm(`Supprimer la pizza ${p.name} ?`)) return;

  await db.from("recipes").delete().eq("product_id", productId);
  const { error } = await db.from("products").delete().eq("id", productId);
  if (error) return alert(error.message);
  await loadAll();
}

function resetPizzaForm() {
  editingPizzaId.value = "";
  pizzaName.value = "";
  pizzaPrice.value = "";
  pizzaRecipe.value = "";
  pizzaFormTitle.textContent = "Créer une pizza";
}

function renderAdminProducts() {
  adminProducts.innerHTML = products.map(p => {
    const rec = productRecipe(p.id).map(r => `<span class="badge">${r.ingredient_name}: ${r.quantity}</span>`).join(" ");
    return `
      <div class="card">
        <div class="pizza-title">${p.name}</div>
        <div class="price">${fmt(p.price)}</div>
        <p>${rec || "Aucune recette"}</p>
        <div class="actions">
          <button class="export-btn" onclick="editPizza('${p.id}')">Modifier</button>
          <button class="danger-btn" onclick="deletePizza('${p.id}')">Supprimer</button>
        </div>
      </div>
    `;
  }).join("");
}
