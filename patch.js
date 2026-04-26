Hooks.once("ready", async () => {
  if (game.system.id !== "pf2e") return;

  const browser = game.pf2e?.compendiumBrowser;
  const tab = browser?.tabs?.action;
  if (!tab) return;

  const response = await fetch("modules/pf2e-ru-v14-patch/action-pf2e.json");
  const data = await response.json();

  const translations = {};
  for (const [englishName, value] of Object.entries(data.PF2E)) {
    if (value?.Title) translations[englishName] = value.Title;
  }

  await tab.init?.();

  const fields = tab.searchEngine?._storedFields;
  if (!fields) return;

  let count = 0;

  for (const entry of fields.values()) {
    const ru = translations[entry.name];
    if (!ru) continue;

    entry.originalName = entry.name;
    entry.name = `${ru} — ${entry.name}`;
    count++;
  }

  console.log(`PF2e RU V14 Patch: patched ${count} action names`);
});
