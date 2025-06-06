import defaultSchema from "../constants/schema";
import formatResponse from "../helpers/formatResponse";
import supabaseInstance from "../services/supabaseInstance";

export const validator = async (req, res, next) => {
  const keys = Object.keys(req.body);
  const partialSchema = defaultSchema.fork(Object.keys(defaultSchema.describe().keys).filter(k => !keys.includes(k)), field => field.optional());

  const { error } = partialSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = {};

    let maxIndexes = {};

    error.details.forEach(err => {
      const path = err.path;

      if (path.length >= 3 && typeof path[1] === "number") {
        const parent = path[0];
        const index = path[1];
        const field = path[2];

        maxIndexes[parent] = Math.max(maxIndexes[parent] || 0, index);

        if (!errors[parent]) {
          errors[parent] = [];
        }

        if (!errors[parent][index]) {
          errors[parent][index] = {};
        }

        errors[parent][index][`${field}_error`] = err.message;

      } else {
        const key = `${path[0]}`;
        errors[`${key}_error`] = err.message;
      }
    });

    for (const [key, maxIndex] of Object.entries(maxIndexes)) {
      if (!errors[key]) continue;

      for (let i = 0; i <= maxIndex; i++) {
        if (!errors[key][i]) {
          errors[key][i] = {};
        }
      }
    }

    return formatResponse({
      req,
      res,
      code: 400,
      data: null,
      message: "Terdapat kesalahan pada data yang dikirim",
      error : { validator: errors }
    });
  }

  next();
};

export const validatorWithUnique = async (req, res, next) => {
  const { email, nik, children = [] } = req.body;

  const emailCheckPromise = supabaseInstance
    .from("users_table")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const userNikCheckPromise = supabaseInstance
    .rpc("is_nik_taken", { nik_to_check: Number(nik) });

  const childrenNikCheckPromises = children.map(child =>
    supabaseInstance.rpc("is_nik_taken", { nik_to_check: Number(child.nik) })
  );

  const [userEmailCheck, userNikCheck, ...childrenNikResults] = await Promise.all([
    emailCheckPromise,
    userNikCheckPromise,
    ...childrenNikCheckPromises
  ]);

  const uniquenessErrors = {};

  if (userEmailCheck.data) {
    uniquenessErrors.email_error = "Email sudah digunakan";
  }

  if (userNikCheck.data === true) {
    uniquenessErrors.nik_error = "NIK sudah digunakan";
  }

  const childNikCount = {};
  const childrenErrors = children.map(() => ({}));

  children.forEach((child, index) => {
    const childNik = Number(child.nik);

    childNikCount[childNik] = (childNikCount[childNik] || 0) + 1;

    if (childNik === Number(nik)) {
      childrenErrors[index].nik_error = "NIK anak tidak boleh sama dengan NIK pengguna utama";
    }

    if (childrenNikResults[index].data === true) {
      childrenErrors[index].nik_error = "NIK anak sudah digunakan";
    }
  });

  children.forEach((child, index) => {
    const childNik = Number(child.nik);
    if (childNikCount[childNik] > 1) {
      childrenErrors[index].nik_error = "Duplikasi NIK antar anak";
    }
  });

  const hasChildrenErrors = childrenErrors.some(err => Object.keys(err).length > 0);
  if (hasChildrenErrors) {
    uniquenessErrors.children = childrenErrors;
  }

  if (Object.keys(uniquenessErrors).length > 0) {
    return formatResponse({
      req,
      res,
      code: 409,
      message: "Terdapat kesalahan pada data yang dikirim",
      data: null,
      error: { validator: uniquenessErrors }
    });
  }

  next();
};