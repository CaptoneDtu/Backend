require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const ApiRes = require("./res/apiRes");

const app = express();
app.use(express.json());

let corsOptions = {
   origin : '*',
}

app.use(cors(corsOptions));

connectDB();

const routes = require("./routes");
app.use("/api", routes);

app.use((req, res) => {
  ApiRes.notFound(res, `Cannot ${req.method} ${req.originalUrl}`);
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));