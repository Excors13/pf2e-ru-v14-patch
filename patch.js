Hooks.once("ready", async () => {
  setTimeout(async () => {
    if (game.system.id !== "pf2e") return;

    const normalize = (text) =>
      String(text ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const response = await fetch("modules/pf2e-ru-v14-patch/action-pf2e.json");
    const data = await response.json();
    const actions = data.PF2E.Actions;

    // -----------------------------
    // Названия действий в браузере
    // -----------------------------
    const translations = {};

    for (const [englishKey, value] of Object.entries(actions)) {
      if (value?.Title) {
        translations[normalize(englishKey)] = value.Title;
      }
    }

    const browser = game.pf2e?.compendiumBrowser;
    const tab = browser?.tabs?.action;
    if (!tab) return;

    await tab.init?.();

    const fields = tab.searchEngine?._storedFields;
    if (!fields) return;

    let count = 0;

    for (const entry of fields.values()) {
      const key = normalize(entry.name);
      const ru = translations[key];
      if (!ru) continue;

      entry.originalName = entry.name;
      entry.name = `${ru} — ${entry.name}`;
      count++;
    }

    console.log(`PF2e RU V14 Patch: patched ${count} action names`);

    // -----------------------------
    // Русские описания действий
    // -----------------------------
    Hooks.on("renderItemSheet", (app) => {
      const item = app.document;
      if (!item || item.type !== "action") return;

      // Защита от повторной подмены
      if (item.flags?.pf2eruPatched) return;

      const key = normalize(item.system?.slug ?? item.name);

      const actionData =
        actions[
          Object.keys(actions).find(
            (k) => normalize(k) === key
          )
        ];

      if (!actionData?.Description) return;

      item.system.description.value = actionData.Description;

      item.flags.pf2eruPatched = true;

      app.render(true);
    });

  }, 3000);
});
