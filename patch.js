Hooks.once("ready", async () => {
  if (game.system.id !== "pf2e") return;

const translations = {
  "Grapple": "Захватить",
  "Disarm": "Разоружение",
  "Shove": "Толчок",
  "Trip": "Подсечка",
  "Demoralize": "Деморализовать"
};

  const browser = game.pf2e?.compendiumBrowser;
  if (!browser) return;

  const tab = browser.tabs?.action;
  if (!tab) return;

  await tab.init?.();

  const fields = tab.searchEngine?._storedFields;
  if (!fields) return;

  for (const entry of fields.values()) {
    if (translations[entry.name]) {
      entry.originalName = entry.name;
      entry.name = `${translations[entry.name]} — ${entry.name}`;
    }
  }

  console.log("PF2e RU Patch loaded");
});
