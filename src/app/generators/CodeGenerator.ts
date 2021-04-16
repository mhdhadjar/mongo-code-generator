/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import GeneratorUtils, { __ARRAY_RECURSIVE__, __OBJECT_RECURSIVE__ } from "./GeneratorUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateSchema = (dbObject: any, collectionName: string): string => {
  const camelCasedName = GeneratorUtils.getCamelCasedName(collectionName);
  const schemaContent = setTypesRecursively(dbObject);

  const prettify = JSON.stringify(JSON.parse(schemaContent), null, 2).replace(/"/g, "");

  return `const ${camelCasedName}Schema = new Schema(${prettify});\n\nconst ${camelCasedName} = mongoose.model('${collectionName}', ${camelCasedName}Schema);`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setTypesRecursively = (object: any) => {
  const schemaContent: string[] = [];

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    const value = GeneratorUtils.getFieldType(object[key]);

    if (value === __ARRAY_RECURSIVE__) {
      const value = GeneratorUtils.getFieldType(object[key][0]);

      if (value === __OBJECT_RECURSIVE__ || value === __ARRAY_RECURSIVE__) {
        schemaContent.push(`"${[key]}": [${setTypesRecursively(object[key][0])}]`);
      } else {
        schemaContent.push(`"${[key]}": ["${value}"]`);
      }
      continue;
    }
    if (value === __OBJECT_RECURSIVE__) {
      schemaContent.push(`"${[key]}": ${setTypesRecursively(object[key])}`);
      continue;
    }
    schemaContent.push(`"${[key]}": "${value}"`);
  }

  return `{${schemaContent.join(",")}}`;
};

export default {
  generateSchema,
};
