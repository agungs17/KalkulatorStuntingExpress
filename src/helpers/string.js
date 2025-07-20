export const eachFirstCapitalWord = (text) => {
  if (typeof text !== "string") return "";

  return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};


export const sanitizeObject = (obj = {}, fields = [], replacement = "***") => {
  const clone = { ...obj };

  for (const key of fields) {
    if (Object.hasOwn(clone, key)) {
      clone[key] = replacement;
    }
  }

  return clone;
};