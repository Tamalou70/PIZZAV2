async function addDelivery() {
  const row = {
    driver: deliveryDriver.value.trim(),
    count: Number(deliveryCount.value || 0),
    amount: Number(deliveryAmount.value || 0),
    date: deliveryDate.value || todayInput()
  };

  if (!row.driver || !row.count || !row.amount) return alert("Champs livraison obligatoires.");

  const { error } = await db.from("deliveries").insert(row);
  if (error) return alert(error.message);

  deliveryDriver.value = "";
  deliveryCount.value = "";
  deliveryAmount.value = "";
  await loadAll();
}

async function deleteDelivery(id) {
  if (!confirm("Supprimer cette livraison ?")) return;
  const { error } = await db.from("deliveries").delete().eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

function renderDeliveries() {
  if (!deliveriesTable) return;
  deliveriesTable.innerHTML = deliveries.map(d => `
    <tr>
      <td>${d.date}</td>
      <td>${d.driver}</td>
      <td>${d.count}</td>
      <td>${fmt(d.amount)}</td>
      <td><button class="danger-btn" onclick="deleteDelivery('${d.id}')">Supprimer</button></td>
    </tr>
  `).join("");
}
