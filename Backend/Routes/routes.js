//Endpoints de la Aplicación
import express from "express";
import { encargadoController, encuestaController } from "../Container.js";

//Enrutador
const router = express.Router();

//Endpoints Para Formulario
router.get('/getForm', async (req, res) => {
    const name = req.query.name;
    const data = await encuestaController.getForm(name);
    res.json(data);
});

router.get('/getFormFromCache', async(req, res) => {
    const name = req.query.name;
    const data = await encuestaController.getFormFromCache(name);
    res.json(data);
});

router.post("/guardarRespuestaEnArchivo", (req, res) => encuestaController.guardarRespuestasEnArchivo(req, res));
router.post("/migrateData", (req, res) => encuestaController.migrateData(req,res));


//Endpoints Para Encargado
router.get('/getEncargado', (req, res) => encargadoController.getEncargado(req, res));
router.post('/crearEncargado', (req, res) => encargadoController.postEncargado(req, res));



export default router


