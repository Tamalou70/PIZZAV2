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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(value) {
  if (!value) return new Date();

  const clean = String(value).slice(0, 10);
  const [year, month, day] = clean.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function dateInRange(value, start, end) {
  const d = parseLocalDate(value);
  d.setHours(0, 0, 0, 0);

  return d >= start && d <= end;
}

function weekInfo(dateValue) {
  const d = parseLocalDate(dateValue || todayInput());
  d.setHours(0, 0, 0, 0);

  const day = d.getDay() || 7;

  const start = new Date(d);
  start.setDate(d.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((Math.floor((d - jan1) / 86400000) + jan1.getDay() + 1) / 7);

  return {
    week,
    start,
    end,
    label: `Semaine ${week}`,
    range: `du ${start.toLocaleDateString("fr-FR")} au ${end.toLocaleDateString("fr-FR")}`
  };
}
