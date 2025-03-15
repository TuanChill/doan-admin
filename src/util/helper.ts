export function createArrayFrom1ToN(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}

export const parseHashMapString = (hashMapString: string) => {
  // Step 1: Clean up the string to make it JSON-compatible
  const jsonString = hashMapString
    .replace(/=/g, ':') // Replace '=' with ':'
    .replace(/(\w+):/g, '"$1":') // Add double quotes to keys
    .replace(/([{[,])(\s*)?([^"[\],{}\s]+)/g, '$1"$3"') // Add quotes to unquoted keys
    .replace(/:(?=[,}])/g, ':""') // Replace empty values with empty strings
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/"\[/g, '[') // Remove quotes around arrays
    .replace(/\]"/g, ']'); // Remove quotes around arrays

  const parsedObject = JSON.parse(jsonString);

  // Step 3: Convert the object into an array of key-value pairs
  const result = Object.entries(parsedObject).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => ({ key, value: v }));
    }
    return { key, value };
  });
  return result;
};

export const maskingString = (str: string, start: number, end: number) => {
  const maskedStr =
    str.slice(0, start) + '*'.repeat(6) + str.slice(str.length - end);
  return maskedStr;
};
