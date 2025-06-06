import fs from "fs/promises";
import path from "path";

export const getFilePublic = async(subFolder, nameFile) => {
  const filePath = path.join(process.cwd(), "public", subFolder, nameFile);
  return await fs.readFile(filePath, "utf-8");
};