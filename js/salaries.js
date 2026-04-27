async function addSalary() {
  const row = {
    employee: salaryEmployee.value.trim(),
    amount: Number(salaryAmount.value || 0),
    note: salaryNote.value.trim(),
    date: salaryDate.value || todayInput()
  };

  if (!row.employee || !row.amount) return alert("Employé et montant obligatoires.");

  const { error } = await db.from("salaries").insert(row);
  if (error) return alert(error.message);

  salaryEmployee.value = "";
  salaryAmount.value = "";
  salaryNote.value = "";
  await loadAll();
}

async function deleteSalary(id) {
  if (!confirm("Supprimer ce salaire ?")) return;
  const { error } = await db.from("salaries").delete().eq("id", id);
  if (error) return alert(error.message);
  await loadAll();
}

function renderSalaries() {
  if (!salariesTable) return;
  salariesTable.innerHTML = salaries.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.employee}</td>
      <td>${fmt(s.amount)}</td>
      <td>${s.note || "-"}</td>
      <td><button class="danger-btn" onclick="deleteSalary('${s.id}')">Supprimer</button></td>
    </tr>
  `).join("");
}
