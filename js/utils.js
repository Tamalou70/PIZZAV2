const fmt = n => `${Number(n || 0).toFixed(2)}$`;
const normalizeDiscord = value => value.trim().toLowerCase();
const normalizeName = value => value.trim().toLowerCase();
function taxFromTTC(ttc){const ht=ttc/(1+TVA_RATE);return{ht,tax:ttc-ht};}
function isPatron(){return currentStaff&&currentStaff.role==="patron";}
