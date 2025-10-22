import express from "express";
import cors from "cors";
import connectDB from "./DataBase/db.js";
import routes from "./Routes/routes.js";

connectDB();

const app = express();
const PORT = 5001;


app.use(cors()); 
app.use(express.json());

app.use("/", routes);

app.get("/", (req, res) => {
    res.send({ message: "¡Servidor Express en funcionamiento!" });
});

app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});
