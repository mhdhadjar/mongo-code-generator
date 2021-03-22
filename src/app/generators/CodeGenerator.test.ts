import { generateSchema } from "./CodeGenerator";

it("getCamelCasedName", () => {
  const dummyDbDocument = { dummyDbObject: 1 };
  expect(generateSchema(dummyDbDocument, "dummy_collection_name")).toContain("const dummyCollectionNameSchema = new Schema");
  expect(generateSchema(dummyDbDocument, "dummy_collection_name")).toContain("dummyDbObject: Number");
  expect(generateSchema(dummyDbDocument, "dummy_collection_name")).toContain("const dummyCollectionName = mongoose.model('dummy_collection_name', dummyCollectionNameSchema);");
});
