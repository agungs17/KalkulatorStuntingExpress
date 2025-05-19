var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/configurations/index.js
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  runtime: process.env.RUNTIME || void 0,
  esBuild: process.env.ES_BUILD || void 0,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  logging: false
};
var configurations_default = config;

// src/server.js
var import_express2 = __toESM(require("express"));

// src/utils/scripts.js
function formatResponse({
  identifier = "Response",
  res,
  code = 200,
  data = null,
  msgSuccess = "Permintaan berhasil.",
  msgError = "Sepertinya ada yang tidak beres.",
  msgEmpty = "Data tidak di temukan."
}) {
  let status = code;
  let message = "";
  let finalData = null;
  if ([200, 201, 204].includes(status)) {
    if (Array.isArray(data) && data.length === 0) {
      status = 404;
      message = msgEmpty;
    } else {
      message = msgSuccess;
      finalData = data;
    }
  } else {
    message = msgError;
  }
  const result = {
    status,
    message,
    data: finalData
  };
  if (configurations_default.logging === "development") {
    console.log(`[${identifier}]`, result);
  }
  return res.status(status).json(result);
}

// src/routes/auth.js
var import_express = __toESM(require("express"));

// src/controllers/auth.js
var loginController = (_, res) => {
  return formatResponse({ identifier: "login", res, msgSuccess: "Login successful!" });
};

// src/routes/auth.js
var app = import_express.default.Router();
app.get("/login", loginController);
var auth_default = app;

// src/server.js
var app2 = (0, import_express2.default)();
var apiRouter = import_express2.default.Router();
app2.use(import_express2.default.json());
app2.get("/", (_, res) => res.redirect("/api"));
apiRouter.get(
  "/",
  (_, res) => formatResponse({
    identifier: "healthCheck",
    res,
    msgSuccess: "API is running properly!"
  })
);
apiRouter.use("/auth", auth_default);
app2.use("/api", apiRouter);
var server_default = app2;

// index.js
var port = configurations_default.port || 3e3;
server_default.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
