const express = require("express");
const dotenv = require("dotenv");

const v1Routes = require("./routes/v1.routes");
const { connection } = require("./connections/mongodb.connection");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 2000;

connection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", v1Routes);

app.all("*", (req, res) => {
	res.status(404).json({ status: "error", message: "Invalid route!" });
});

app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}...`);
});
