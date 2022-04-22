require("dotenv").config();
const Server = require("./models/server");

console.log("NODE_ENVV", process.env.NODE_ENV);
console.log("FRONT_NODE_ENV", process.env.FRONT_NODE_ENV);
console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);

const server = new Server();

server.listen();
