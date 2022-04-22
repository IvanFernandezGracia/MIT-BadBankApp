const express = require("express");
const cors = require("cors");
// const fileUpload = require("express-fileupload");

const { connectMongoAtlas } = require("../database/mongoConfig");
const { connectRedis } = require("../database/redisConfig");

const csrf = require("csurf");

var colors = require("colors/safe");
const cookieParser = require("cookie-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // CORS list white Constructor
    this.corsOptions = {
      optionsSuccessStatus: 200,
      credentials: true,
      origin: function (origin, callback) {
        const whiteList = [
          process.env.DOMAIN_FRONT_REACT_PROD_1,
          process.env.DOMAIN_FRONT_REACT_PROD_2,
          process.env.NODE_ENV === "production"
            ? ""
            : process.env.DOMAIN_FRONT_REACT_DEV,
          process.env.NODE_ENV === "production"
            ? ""
            : process.env.DOMAIN_FRONT_REACT_DEVS,
        ];
        console.log("****************** [newRequest]******************");
        if (whiteList.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };

    // Path Constructor
    this.paths = {
      auth: "/api/auth",
      users: "/api/users",
      deposits: "/api/deposits",
      whitdraws: "/api/whitdraws",
      csrf: "/api/csrf",
      payments: "/api/payments",
    };

    // Connect Database Mongo Atlas & Database Redis
    this.ConnectDB().then(() => {
      // Middlewares
      this.middlewares();
      // Routes of my applicationn
      this.routes();
      // Error Handling (It must be one of the last ones because it does not contain NEXT)
      this.handleErrors();
      //Documentation API
      this.swagger();
    });
  }

  async ConnectDB() {
    await connectMongoAtlas();
    await connectRedis();
  }

  middlewares() {
    // Undefine origin
    this.app.use(function (req, res, next) {
      console.log("origin", req.headers.origin);
      console.log("host", req.headers.host);
      console.log(JSON.stringify(req.headers));

      req.headers.origin = req.headers.origin || req.headers.host;

      console.log("originNew", req.headers.origin);
      next();
    });
    // CORS
    this.app.use(cors(this.corsOptions)); // Postam dont work and cookies credentials
    // this.app.use(cors());

    // Lectura y parseo del body
    // Cualquier request del front en el body la va intentar serealizar en .json
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));

    // Parse cookies: need if "cookie" is true in csrfProtection
    this.app.use(cookieParser());

    //  CSRF Tokens Midleware
    const csrfProtection = csrf({
      cookie: {
        key: "_csrf-my-app",
        path: "/",
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
        maxAge: parseInt(process.env.EXPIRATION_TOKEN_CSRF),
      },
      ignoreMethods: ["GET"],
    });
    this.app.use(csrfProtection);

    // Fileupload - Carga de archivos
    // this.app.use(
    //   fileUpload({
    //     useTempFiles: true,
    //     tempFileDir: "/tmp/",
    //     createParentPath: true,
    //   })
    // );
  }

  routes() {
    this.app.use(this.paths.csrf, require("../routes/csrf"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.deposits, require("../routes/deposits"));
    this.app.use(this.paths.whitdraws, require("../routes/whitdraws"));
    this.app.use(this.paths.payments, require("../routes/payments"));
  }

  handleErrors() {
    this.app.use("/", function (err, req, res, next) {
      if (err) {
        const statusResponse = err.status || 500;
        const data = {
          name: err.name || "Server Error",
          message: err.message || "",
          status: statusResponse,
        };
        console.log(colors.red(data));

        res.status(statusResponse);
        res.json(data);
      } else {
        next();
      }
    });
  }

  swagger() {
    // Swagger conf
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Mit Bad Bank AAPI Docs",
          version: "0.1.0",
          description:
            "Esta api fue creada en el proyecto capston de curso fullstack developer MERN",
          license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html",
          },
          contact: {
            name: "Ivan Fernandez Gracia",
            url: "",
          },
        },
        servers: [
          {
            syntaxHighlight: {
              activated: false,
              theme: "arta",
            },
            url: "http://localhost:5000/",
          },
        ],
      },
      apis: ["./documentation/*.yml"],
    };
    const specs = swaggerJsdoc(options);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(colors.yellow("Servidor corriendo en puerto"), this.port);
    });
  }
}

module.exports = Server;
