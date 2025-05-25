export const eachFirstCapitalWord = (text) => {
  if (typeof text !== "string") return "";

  return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
