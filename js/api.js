// ── API — kommuniserer med Google Apps Script ─────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbycgJ6k0-_a4Yh9kds_csVSwmMIElhURZrOy2HHdn41Y8dAM8gxMvuirvkiDnH1sYH9hQ/exec";

const api = {
  // Les-operasjoner via GET
  async getEntries() {
    const res = await fetch(`${API_URL}?action=getEntries`);
    return res.json();
  },
  async getResults() {
    const res = await fetch(`${API_URL}?action=getResults`);
    return res.json();
  },
  // Skriv-operasjoner via GET med parametere (unngår CORS-problemer med POST)
  async saveEntry(name, bracket) {
    const params = new URLSearchParams({
      action: "saveEntry",
      name: name,
      bracket: JSON.stringify(bracket)
    });
    const res = await fetch(`${API_URL}?${params.toString()}`);
    return res.json();
  },
  async saveResults(bracket) {
    const params = new URLSearchParams({
      action: "saveResults",
      bracket: JSON.stringify(bracket)
    });
    const res = await fetch(`${API_URL}?${params.toString()}`);
    return res.json();
  },
};
