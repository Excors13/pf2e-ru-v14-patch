Hooks.once("ready", async () => {
  if (game.system.id !== "pf2e") return;

  const pack = game.packs.get("pf2e.actionspf2e");
  if (!pack) {
    console.warn("PF2e RU V14 Patch: pack pf2e.actionspf2e не найден");
    return;
  }

  const index = await pack.getIndex();
  const grapple = index.find((entry) => entry.name === "Grapple");

  if (grapple) {
    grapple.name = "Захват";
    console.log("PF2e RU V14 Patch: Grapple переименован в индексе");
  } else {
    console.warn("PF2e RU V14 Patch: Grapple не найден в индексе");
  }
});