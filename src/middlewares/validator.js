import defaultSchema from "../constants/schema";
import formatResponse from "../helpers/formatResponse";

export const validator = async (req, res, next) => {
    const keys = Object.keys(req.body);

    // add to defaultSchema if you want need
    const partialSchema = defaultSchema.fork(
      Object.keys(defaultSchema.describe().keys).filter(key => !keys.includes(key)),
      (field) => field.optional()
    );

    const { error } = partialSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach(err => {
        const key = `${err.path[0]}_error`;
        errors[key] = err.message;
      });

      return formatResponse({ req, res, code: 400, data: null, error: errors, message: 'Validasi gagal' });
    }

    next();
};
