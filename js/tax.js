function cleanDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function buildTaxData() {
  const taxDateEl = document.getElementById("taxDate");
  const info = weekInfo(taxDateEl?.value || todayInput());

  const weekSales = sales.filter(s =>
    dateInRange(cleanDate(s.created_at), info.start, info.end)
  );

  const weekDeliveries = deliveries.filter(d =>
    dateInRange(cleanDate(d.date), info.start, info.end)
  );

  const weekSalaries = salaries.filter(s =>
    dateInRange(cleanDate(s.date), info.start, info.end)
  );

  const salesTTC = weekSales.reduce(
    (sum, s) => sum + Number(s.total || 0),
    0
  );

  const { ht: salesHT, tax: salesTVA } = taxFromTTC(salesTTC);

  const deliveryTotal = weekDeliveries.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const deliveryCount = weekDeliveries.reduce(
    (sum, d) => sum + Number(d.count || 0),
    0
  );

  const salaryTotal = weekSalaries.reduce(
    (sum, s) => sum + Number(s.amount || 0),
    0
  );

  const totalDeclare = salesTTC + deliveryTotal;
  const result = salesHT + deliveryTotal - salaryTotal;

  return {
    info,
    salesTTC,
    salesHT,
    salesTVA,
    deliveryTotal,
    deliveryCount,
    salaryTotal,
    totalDeclare,
    result
  };
}

function renderTaxSheet() {
  const taxDateEl = document.getElementById("taxDate");
  const taxSheetEl = document.getElementById("taxSheet");

  if (!taxSheetEl) return;

  if (taxDateEl && !taxDateEl.value) {
    taxDateEl.value = todayInput();
  }

  const d = buildTaxData();

  taxSheetEl.innerHTML = `
    <h3>Fiche imposition - ${d.info.label}</h3>
    <p>${d.info.range}</p>

    <div class="tax-row"><span>Ventes pizzeria TTC</span><strong>${fmt(d.salesTTC)}</strong></div>
    <div class="tax-row"><span>Ventes pizzeria HT</span><strong>${fmt(d.salesHT)}</strong></div>
    <div class="tax-row"><span>TVA 30%</span><strong>${fmt(d.salesTVA)}</strong></div>
    <div class="tax-row"><span>Nombre livraisons</span><strong>${d.deliveryCount}</strong></div>
    <div class="tax-row"><span>Solde livraisons</span><strong>${fmt(d.deliveryTotal)}</strong></div>
    <div class="tax-row"><span>Salaires employés</span><strong>${fmt(d.salaryTotal)}</strong></div>
    <div class="tax-row total"><span>Total déclaré</span><strong>${fmt(d.totalDeclare)}</strong></div>
    <div class="tax-row result"><span>Résultat estimé</span><strong>${fmt(d.result)}</strong></div>
  `;
}
