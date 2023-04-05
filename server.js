const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
var cors = require("cors");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

//CORS
app.use(cors());
//Body parser
app.use(express.json());
//Sanitize data
app.use(mongoSanitize());
//Helmet API Header
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [
      {
        url: "http://localhost:5001/api/v1",
      }
    ]
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
//Mount routers
const hospitals = require("./routes/hospitals");
const appointments = require("./routes/appointments");
const auth = require("./routes/auth");
//Cookie parser
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({ success: true, data: { id: 1 } });
});
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, " mode on_port", PORT)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
