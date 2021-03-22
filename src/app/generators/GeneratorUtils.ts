import * as mongoose from "mongoose";

export const __ARRAY_RECURSIVE__ = "__ARRAY_RECURSIVE__";
export const __OBJECT_RECURSIVE__ = "__OBJECT_RECURSIVE__";

const getFieldType = (data: unknown): string => {
  if (typeof data === "string") return "String";
  if (typeof data === "number") return "Number";
  if (typeof data === "boolean") return "Boolean";

  if (data instanceof mongoose.Schema.Types.ObjectId) return "mongoose.ObjectId";
  if (data instanceof Array) return __ARRAY_RECURSIVE__;
  if (data instanceof Date) return "Date";

  const stringified = JSON.stringify(data) || "";

  if (stringified.startsWith("{")) return __OBJECT_RECURSIVE__;
  return `mongoose.Mixed /* TODO:Check, data was '${stringified}' */`;
};

const getCamelCasedName = (name: string): string => {
  return name.replace(/_[a-zA-Z0-9]/g, function (match) {
    return match.toString().toUpperCase().substring(1);
  });
};

export default {
  getFieldType,
  getCamelCasedName,
};
