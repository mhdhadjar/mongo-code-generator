import * as mongoose from "mongoose";
import ConnectToMongoDb from "./ConnectToMongoDb";
import { ISystemSettings } from "./SystemSettings";

export interface IListDatabaseResult {
  databases: IListDatabaseItem[];
  totalSize: number;
  ok: number;
}

export interface IListDatabaseItem {
  name: string;
  sizeOnDisk: number;
  empty: boolean;
}

export const getDatabases = async (settings: ISystemSettings): Promise<IListDatabaseResult> => {
  await ConnectToMongoDb(settings);
  const result: IListDatabaseResult = await mongoose.connection.db.admin().listDatabases();
  if (result.databases && result.databases.length > 0) result.databases = [...result.databases].filter((x) => x.name !== "admin" && x.name !== "config" && x.name !== "local");
  return result;
};

export const getCollections = async (settings: ISystemSettings): Promise<string[]> => {
  await ConnectToMongoDb(settings);
  const result = await mongoose.connection.db.collections();
  return result.map((x) => x.collectionName);
};

export const getFirstDocument = async (settings: ISystemSettings, collection: string): Promise<unknown> => {
  await ConnectToMongoDb(settings);
  return (await mongoose.connection.db.collection(collection).findOne({})) || {};
};
