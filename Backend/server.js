// Main server file for initializing the Express application

import express from "express";
import cors from "cors";
import connectDB from "./DataBase/db.js";
import routes from "./Routes/routes.js";


connectDB();

const app = express();
const PORT = 5000;


app.use(cors()); 
app.use(express.json()); 

es
app.use("/", routes);


app.get("/", (req, res) => {
    res.send({ message: "Express server running successfully!" });
});


app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
