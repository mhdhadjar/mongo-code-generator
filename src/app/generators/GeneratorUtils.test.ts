import GeneratorUtils, { __OBJECT_RECURSIVE__, __ARRAY_RECURSIVE__ } from "./GeneratorUtils";
import * as mongoose from "mongoose";

it("getCamelCasedName", () => {
  expect(GeneratorUtils.getCamelCasedName("this_is_a_Collection_Name")).toBe("thisIsACollectionName");
  expect(GeneratorUtils.getCamelCasedName("this_is_a_12_Name")).toBe("thisIsA12Name");
  expect(GeneratorUtils.getCamelCasedName("thisIsACollectionName")).toBe("thisIsACollectionName");
});

it("getFieldType", () => {
  expect(GeneratorUtils.getFieldType(new Date())).toBe("Date");
  expect(GeneratorUtils.getFieldType(15)).toBe("Number");
  expect(GeneratorUtils.getFieldType(new mongoose.Schema.Types.ObjectId(""))).toBe("mongoose.SchemaTypes.ObjectId");
  expect(GeneratorUtils.getFieldType("Some String Value")).toBe("String");
  expect(GeneratorUtils.getFieldType(null)).toBe("mongoose.SchemaTypes.Mixed");
  expect(GeneratorUtils.getFieldType(undefined)).toBe("mongoose.SchemaTypes.Mixed");
  expect(GeneratorUtils.getFieldType({ test: "This is a JSON object" })).toBe(__OBJECT_RECURSIVE__);
  expect(GeneratorUtils.getFieldType([{ test: "This is a JSON object" }])).toBe(__ARRAY_RECURSIVE__);
  expect(GeneratorUtils.getFieldType(["A", "B", "C"])).toBe(__ARRAY_RECURSIVE__);
});
