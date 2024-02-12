const toCamelCase = (text) => {
  // Split the text into words
  const words = text.split(" ");

  // Convert the first word to lowercase
  const firstWord = words[0].toLowerCase();

  // Convert the rest of the words to camelCase
  const camelCaseWords = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Join the words and return the result
  return firstWord + camelCaseWords.join("");
};

const flattenObject = (obj) => {
  const flattened = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const flatObject = flattenObject(obj[key]);
      for (const flatKey in flatObject) {
        flattened[`${key}.${flatKey}`] = flatObject[flatKey];
      }
    } else {
      flattened[key] = obj[key];
    }
  }
  return flattened;
};

export { toCamelCase, flattenObject };
