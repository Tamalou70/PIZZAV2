const fmt = n => `${Number(n || 0).toFixed(2)}$`;

const normalizeDiscord = value => value.trim().toLowerCase();

const normalizeName = value => value.trim().toLowerCase();

function taxFromTTC(ttc) {
  const ht = ttc / (1 + TVA_RATE);
  return { ht, tax: ttc - ht };
}

function isPatron() {
  return currentStaff && currentStaff.role === "patron";
}

function todayInput() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dateInRange(value, start, end) {
  const d = new Date(value);
  const clean = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return clean >= start && clean <= end;
}

function weekInfo(dateValue) {
  const d = dateValue ? new Date(dateValue) : new Date();
  const day = d.getDay() || 7;
  const start = new Date(d);
  start.setDate(d.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((Math.floor((d - jan1) / 86400000) + jan1.getDay() + 1) / 7);
  return { week, start, end, label: `Semaine ${week}`, range: `du ${start.toLocaleDateString("fr-FR")} au ${end.toLocaleDateString("fr-FR")}` };
}
