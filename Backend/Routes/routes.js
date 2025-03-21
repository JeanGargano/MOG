//Rutas de los endpoints de la aplicación
import express from "express";
import { getAll } from "../Controllers/getAll";
import { get_by_id } from "../Controllers/Get_by_id";
import { post } from "../Controllers/Post";


const router = express.Router();

router.get("/getAll", getAll)
router.get("/getById/:id", get_by_id)
router.post("postAnswer", post)

export default router
 

