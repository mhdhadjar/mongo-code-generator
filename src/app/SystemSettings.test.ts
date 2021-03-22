import SystemSettings from "./SystemSettings";

it("modifySettings", async () => {
  // Read settings and change database name
  let settings = await SystemSettings.get();
  const oldValue = settings.database || "";
  const newName = oldValue + "__TEST";
  settings.database = newName;

  // Save changes
  await SystemSettings.set(settings);

  // Get setting, should be the new value
  settings = await SystemSettings.get();
  expect(settings.database).toBe(newName);

  // Revert changes and save again
  settings.database = oldValue;
  await SystemSettings.set(settings);

  // Should be the old value
  expect(settings.database).toBe(oldValue);
});
