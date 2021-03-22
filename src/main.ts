import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { generateSchema } from "./app/generators/CodeGenerator";
import { getCollections, getDatabases, getFirstDocument } from "./app/MongoDbProvider";
import SystemSettings from "./app/SystemSettings";

let mainWindow: BrowserWindow;
app.setName("MongoDb Code Generator");

ipcMain.on("connect-button-clicked", async (_e, data) => {
  const settings = await SystemSettings.get();
  settings.host = data.host || "localhost";
  settings.port = parseInt(data.port) || 27017;
  await SystemSettings.set(settings);

  try {
    const databaseListResult = await getDatabases(settings);
    if (mainWindow)
      mainWindow.webContents.send(
        "databases-received",
        databaseListResult.databases.map((x) => x.name)
      );
  } catch (error) {
    mainWindow.webContents.send("connection-failed", error);

    return;
  }
});

ipcMain.on("generate-code", async (_e, data) => {
  const settings = await SystemSettings.get();

  const document = await getFirstDocument(settings, data.collection);

  switch (data.codeType.toLowerCase()) {
    case "schema":
      mainWindow.webContents.send("code-received", { codeType: data.codeType, code: generateSchema(document, data.collection) });
      break;

    default:
      mainWindow.webContents.send("code-received", { codeType: data.codeType, code: `Unknown codeType! ${data.codeType}` });
      break;
  }
});

ipcMain.on("databases-select-changed", async (_e, databaseName) => {
  try {
    const settings = await SystemSettings.get();
    settings.database = databaseName;
    await SystemSettings.set(settings);
    const collections = await getCollections(settings);
    if (mainWindow) mainWindow.webContents.send("collections-received", collections);
  } catch (error) {
    mainWindow.webContents.send("error-in-getting-collections", error);
  }
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    title: "Mongo Code Generator",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.once("show", async () => {
    const settings = await SystemSettings.get();
    setTimeout(() => {
      mainWindow.webContents.send("system-settings-received", settings);
    }, 200);
  });
}

app.on("ready", () => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
