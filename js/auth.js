async function login() {
  loginError.textContent = "";
  const discord = normalizeDiscord(discordInput.value);
  if (!discord) return loginError.textContent = "Identifiant obligatoire.";

  const { data, error } = await db.from("staff").select("*").eq("discord_name", discord).single();
  if (error || !data) return loginError.textContent = "Accès non autorisé.";

  currentStaff = data;
  localStorage.setItem("pizzeria_staff", JSON.stringify(data));
  await enterApp();
}

async function enterApp() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  currentUser.innerHTML = `<strong>${currentStaff.discord_name}</strong><br>${currentStaff.role}`;

  [adminTab, stockTab, deliveriesTab, salariesTab, taxTab, staffTab].forEach(tab => {
    tab.classList.toggle("hidden", !isPatron());
  });

  await loadAll();
  showPage("cashierPage");
}

function logout() {
  localStorage.removeItem("pizzeria_staff");
  location.reload();
}

async function autoLogin() {
  const saved = localStorage.getItem("pizzeria_staff");
  if (!saved) return;
  currentStaff = JSON.parse(saved);

  const { data, error } = await db.from("staff").select("*").eq("discord_name", currentStaff.discord_name).single();
  if (error || !data) {
    localStorage.removeItem("pizzeria_staff");
    return;
  }

  currentStaff = data;
  await enterApp();
}
