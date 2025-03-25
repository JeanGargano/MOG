//Rutas de los endpoints de la aplicación
import express from "express";
import { getAll } from "../Controllers/getAll.js";
import { get_by_id } from "../Controllers/get_by_id.js"
import { post } from "../Controllers/Post.js";


const router = express.Router();

router.get("/getAll", getAll)
router.get("/getById/:id", get_by_id)
router.post("postAnswer", post)

export default router
 

