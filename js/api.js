// ── API — kommuniserer med Google Apps Script ─────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbycgJ6k0-_a4Yh9kds_csVSwmMIElhURZrOy2HHdn41Y8dAM8gxMvuirvkiDnH1sYH9hQ/exec";

const api = {
  async getEntries() {
    try {
      const res = await fetch(`${API_URL}?action=getEntries`);
      return res.json();
    } catch (e) {
      return { ok: false, entries: {} };
    }
  },
  async getResults() {
    try {
      const res = await fetch(`${API_URL}?action=getResults`);
      return res.json();
    } catch (e) {
      return { ok: false, results: null };
    }
  },
  async saveEntry(name, bracket) {
    const params = new URLSearchParams({
      action: "saveEntry",
      name: name,
      bracket: JSON.stringify(bracket)
    });
    try {
      await fetch(`${API_URL}?${params.toString()}`, { mode: "no-cors" });
      return { ok: true };
    } catch (e) {
      throw new Error("Lagring feilet: " + e.message);
    }
  },
  async saveResults(bracket) {
    const params = new URLSearchParams({
      action: "saveResults",
      bracket: JSON.stringify(bracket)
    });
    try {
      await fetch(`${API_URL}?${params.toString()}`, { mode: "no-cors" });
      return { ok: true };
    } catch (e) {
      throw new Error("Lagring feilet: " + e.message);
    }
  },
};
