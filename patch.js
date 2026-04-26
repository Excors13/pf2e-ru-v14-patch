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

    const translations = {};
    for (const [englishKey, value] of Object.entries(actions)) {
      if (value?.Title) translations[normalize(englishKey)] = value.Title;
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

    Hooks.on("renderAbilitySheetPF2e", async (app, html) => {
      const item = app.document;
      if (!item || item.type !== "action") return;

      const key = normalize(item.system?.slug ?? item.name);
      const actionData =
        actions[Object.keys(actions).find((k) => normalize(k) === key)];

      if (!actionData) return;

      const ruTitle = actionData.Title;
      if (ruTitle) {
        html.find('input[name="name"]').val(`${ruTitle} — ${item.name}`);
        html.closest(".window-app").find(".window-title").contents().first()[0].textContent =
          `${ruTitle} — ${item.name}`;
      }

      if (!actionData.Description) return;

      const descriptionBody = html
        .find('.tab.description[data-tab="description"] .main.editor-container .editor-content')
        .first();

      if (descriptionBody.length) {
        const enrichedDescription = await TextEditor.enrichHTML(actionData.Description, {
          async: true,
          documents: true,
          secrets: false,
        });

        descriptionBody.html(enrichedDescription);
      }
    });
  }, 3000);
});
