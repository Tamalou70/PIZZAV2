let currentStaff = null;
let products = [];
let ingredients = [];
let recipes = [];
let sales = [];
let staff = [];
let deliveries = [];
let salaries = [];
let cart = [];

async function loadAll() {
  const [p, i, r, s, st, d, sal] = await Promise.all([
    db.from("products").select("*").order("name"),
    db.from("ingredients").select("*").order("name"),
    db.from("recipes").select("*"),
    db.from("sales").select("*").order("created_at", { ascending: false }).limit(500),
    db.from("staff").select("*").order("created_at", { ascending: false }),
    db.from("deliveries").select("*").order("date", { ascending: false }),
    db.from("salaries").select("*").order("date", { ascending: false })
  ]);

  for (const result of [p, i, r, s, st, d, sal]) {
    if (result.error) {
      alert("Erreur Supabase : " + result.error.message);
      throw result.error;
    }
  }

  products = p.data || [];
  ingredients = i.data || [];
  recipes = r.data || [];
  sales = s.data || [];
  staff = st.data || [];
  deliveries = d.data || [];
  salaries = sal.data || [];
  renderAll();
}

function renderAll() {
  renderProducts();
  renderCart();

  if (isPatron()) {
    renderAdminProducts();
    renderStock();
    renderStaff();
    renderDeliveries();
    renderSalaries();
    renderTaxSheet();
  }
}
