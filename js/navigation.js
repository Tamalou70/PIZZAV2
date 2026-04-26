function showPage(id, btn = null) {
  ["cashierPage", "adminPage", "stockPage", "deliveriesPage", "salariesPage", "taxPage", "staffPage"].forEach(page => {
    document.getElementById(page).classList.toggle("hidden", page !== id);
  });

  document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  renderAll();
}
