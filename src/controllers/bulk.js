import config from "../configurations";
import { getFilePublic } from "../helpers/path";
import supabaseInstance from "../services/supabaseInstance";
import formatResponse from "../helpers/formatResponse";
import { getHeaders } from "../helpers/header";

export const bulkController = async (req, res) => {
  const {bulkToken : token} = getHeaders(req);

  if (token !== config.supabase.bulkToken || !config.supabase.bulkToken) return formatResponse({ req, res, code: 403, message: "Kamu tidak punya akses.", data: null, error: "Forbidden" });

  try {
    const beratRaw = await getFilePublic("json", "berat_table.json");
    const tinggiRaw = await getFilePublic("json", "tinggi_table.json");
    const tinggiVsBeratRaw = await getFilePublic("json", "tinggivsberat_table.json");

    const beratData = JSON.parse(beratRaw);
    const tinggiData = JSON.parse(tinggiRaw);
    const tinggiVsBeratData = JSON.parse(tinggiVsBeratRaw);

    await supabaseInstance.from("berat_table").delete().neq("id", 0);
    await supabaseInstance.from("tinggi_table").delete().neq("id", 0);
    await supabaseInstance.from("tinggivsberat_table").delete().neq("id", 0);

    if (beratData.length > 0) await supabaseInstance.from("berat_table").insert(beratData);
    if (tinggiData.length > 0) await supabaseInstance.from("tinggi_table").insert(tinggiData);
    if (tinggiVsBeratData.length > 0) await supabaseInstance.from("tinggivsberat_table").insert(tinggiVsBeratData);

    return formatResponse({ req, res, code: 200, message: "Bulk data berhasil.", data: null });
  } catch (err) {
    return formatResponse({ req, res, code: 500, error: String(err) });
  }
};