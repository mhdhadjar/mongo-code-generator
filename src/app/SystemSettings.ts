import * as path from "path";
import * as fs from "fs";

let loadedData: ISystemSettings;

export interface ISystemSettings {
  host?: string;
  port?: number;
  database?: string;
}

function getAppDataPath() {
  let homePath = "";
  const appName = process.env.npm_package_name || "";

  switch (process.platform) {
    case "darwin":
      homePath = path.join(process.env.HOME, "Library", "Application Support", appName);
      break;

    case "win32":
      homePath = path.join(process.env.APPDATA, appName);
      break;

    case "linux":
      homePath = path.join(process.env.HOME, `.${appName}`);
      break;

    default:
      console.log("Unsupported platform!");
      process.exit(1);
  }

  if (!fs.existsSync(homePath)) fs.mkdirSync(homePath);
  const fileName = path.join(homePath, "settings.json");
  return fileName;
}

export const set = (json: ISystemSettings): Promise<ISystemSettings> => {
  return new Promise((resolve, reject) => {
    const appDataDirPath = getAppDataPath();
    const stringContent = JSON.stringify(json);
    fs.writeFile(appDataDirPath, stringContent, (err) => {
      if (err) reject(err);
      else resolve(json);
    });
  });
};

export const get = (): Promise<ISystemSettings> => {
  return new Promise((resolve, reject) => {
    if (loadedData) {
      resolve(loadedData);
    }
    const appDataDirPath = getAppDataPath();
    if (!fs.existsSync(appDataDirPath)) resolve({});
    fs.readFile(appDataDirPath, "utf8", (err, data) => {
      if (err) reject(err);
      else {
        const settings: ISystemSettings = data ? JSON.parse(data) : {};
        loadedData = settings;
        resolve(settings);
      }
    });
  });
};

export default {
  get,
  set,
};
