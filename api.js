// ── API — kommuniserer med Google Apps Script ─────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbyHSolWo2JOQqdW9Y8WPJnd-vqNQFrBSm-EM9754zzvpVkt6x_xj1AYuDrzmOJgXvRSTA/exec";

const api = {
  // GET-kall for lesing
  async getEntries() {
    const res = await fetch(`${API_URL}?action=getEntries`);
    return res.json();
  },
  async getResults() {
    const res = await fetch(`${API_URL}?action=getResults`);
    return res.json();
  },
  // Skriving via GET med URL-parametere — unngår CORS-problemer
  async saveEntry(name, bracket) {
    const url = `${API_URL}?action=saveEntry&name=${encodeURIComponent(name)}&bracket=${encodeURIComponent(JSON.stringify(bracket))}`;
    const res = await fetch(url);
    return res.json();
  },
  async saveResults(bracket) {
    const url = `${API_URL}?action=saveResults&bracket=${encodeURIComponent(JSON.stringify(bracket))}`;
    const res = await fetch(url);
    return res.json();
  },
};
