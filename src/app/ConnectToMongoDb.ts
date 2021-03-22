import * as mongoose from "mongoose";
import { ISystemSettings } from "./SystemSettings";

export default async (settings: ISystemSettings): Promise<typeof mongoose> => {
  if (!settings.host) settings.host = "localhost";
  if (!settings.port) settings.port = 27017;

  const newUri = `mongodb://${settings.host}:${settings.port}/${settings.database || "admin"}`;

  // If is already connecting or connected then do nothing.
  if (
    mongoose.connection.port === settings.port &&
    mongoose.connection.host === settings.host &&
    mongoose.connection.name === settings.database &&
    (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)
  )
    return;

  // If is already connecting or connected to other port, host or database then disconnect it.
  if (
    (mongoose.connection.port !== settings.port || mongoose.connection.host !== settings.host || mongoose.connection.name !== settings.database) &&
    (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)
  )
    await mongoose.connection.close();

  // 0: disconnected
  // 1: connected
  // 2: connecting
  // 3: disconnecting
  // 4: invalid credentials

  const timeout = settings.host === "localhost" ? 2000 : 8000;

  return await mongoose.connect(newUri, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: timeout,
    connectTimeoutMS: timeout,
    socketTimeoutMS: timeout,
    family: 4,
  });
};
