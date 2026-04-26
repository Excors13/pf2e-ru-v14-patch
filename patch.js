Hooks.once("ready", async () => {
  if (game.system.id !== "pf2e") return;

  const browser = game.pf2e?.compendiumBrowser;
  if (!browser) return;

  const tab = browser.tabs?.action;
  if (!tab) return;

  await tab.init?.();

  const fields = tab.searchEngine?._storedFields;
  if (!fields) return;

  for (const entry of fields.values()) {
    if (entry.name === "Grapple") {
      entry.originalName = entry.name;
      entry.name = "Захват";
    }
  }

  console.log("PF2e RU V14 Patch: action names patched");
});
