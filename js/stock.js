async function addIngredient() {
  if (!isPatron()) return alert("Accès direction uniquement.");
  const name = normalizeName(newIngredientName.value);
  const stock = Number(newIngredientStock.value || 0);
  const min_stock = Number(newIngredientMin.value || 0);
  if (!name) return alert("Nom ingrédient obligatoire.");

  const { error } = await db.from("ingredients").insert({ name, stock, min_stock });
  if (error) return alert(error.message);

  newIngredientName.value = "";
  newIngredientStock.value = "";
  newIngredientMin.value = "";
  await loadAll();
}

async function adjustStock() {
  const id = stockIngredient.value;
  const qty = Number(stockQty.value || 0);
  const ingredient = ingredients.find(i => i.id === id);
  if (!ingredient || !qty) return alert("Choisis un ingrédient et une quantité.");

  const { error } = await db.from("ingredients").update({ stock: Number(ingredient.stock) + qty }).eq("id", id);
  if (error) return alert(error.message);

  stockQty.value = "";
  await loadAll();
}

async function updateIngredient(id) {
  const ingredient = ingredients.find(i => i.id === id);
  const stock = prompt(`Nouveau stock pour ${ingredient.name}`, ingredient.stock);
  if (stock === null) return;
  const min_stock = prompt(`Stock minimum pour ${ingredient.name}`, ingredient.min_stock);
  if (min_stock === null) return;

  const { error } = await db.from("ingredients").update({ stock: Number(stock), min_stock: Number(min_stock) }).eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

async function deleteIngredient(id) {
  const ingredient = ingredients.find(i => i.id === id);
  if (!confirm(`Supprimer ${ingredient.name} ?`)) return;
  const { error } = await db.from("ingredients").delete().eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

function renderStock() {
  stockTable.innerHTML = ingredients.map(i => {
    const bad = Number(i.stock) <= Number(i.min_stock);
    return `
      <tr>
        <td>${i.name}</td>
        <td>${i.stock}</td>
        <td>${i.min_stock}</td>
        <td>${bad ? '<span class="red">À racheter</span>' : '<span class="green">OK</span>'}</td>
        <td>
          <button class="export-btn" onclick="updateIngredient('${i.id}')">Modifier</button>
          <button class="danger-btn" onclick="deleteIngredient('${i.id}')">Supprimer</button>
        </td>
      </tr>
    `;
  }).join("");

  stockIngredient.innerHTML = ingredients.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
}
