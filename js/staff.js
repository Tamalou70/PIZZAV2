async function addStaff() {
  const discord = normalizeDiscord(newStaffDiscord.value);
  const role = newStaffRole.value;
  if (!discord) return alert("Identifiant obligatoire.");

  const { error } = await db.from("staff").insert({ discord_name: discord, role });
  if (error) return alert(error.message);

  newStaffDiscord.value = "";
  await loadAll();
}

async function changeStaffRole(id, role) {
  const { error } = await db.from("staff").update({ role }).eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

async function deleteStaff(id) {
  const s = staff.find(x => x.id === id);
  if (s.discord_name === currentStaff.discord_name) return alert("Tu ne peux pas supprimer ton propre accès.");
  if (!confirm(`Supprimer l'accès de ${s.discord_name} ?`)) return;

  const { error } = await db.from("staff").delete().eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

function renderStaff() {
  staffTable.innerHTML = staff.map(s => `
    <tr>
      <td>${s.discord_name}</td>
      <td>
        <select onchange="changeStaffRole('${s.id}', this.value)">
          <option value="employe" ${s.role === "employe" ? "selected" : ""}>Employé</option>
          <option value="patron" ${s.role === "patron" ? "selected" : ""}>Patron</option>
        </select>
      </td>
      <td>${s.created_at ? new Date(s.created_at).toLocaleString("fr-FR") : "-"}</td>
      <td><button class="danger-btn" onclick="deleteStaff('${s.id}')">Supprimer</button></td>
    </tr>
  `).join("");
}
