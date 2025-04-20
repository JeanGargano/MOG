//Endpoints de la Aplicación
import express from "express";
import EncuestaController from "../Controller/EncuestaController.js";
import EncargadoController from "../Controller/EncargadoController.js";

//Enrutador
const router = express.Router();

//Endpoint Para obtener formulario
router.get('/getForm', async (req, res) => {
    const name = req.query.name;
    const data = await EncuestaController.getForm(name);
    res.json(data);
});

//Endpoint para obtener Encargado
router.get('/getEncargado', EncargadoController.getEncargado);

//Endpoint para escribir respuestas en archivo
router.post("/writeData", EncuestaController.writeData);

//Endpoint para migrar respuestas a la base de datos
router.post("/postData", EncuestaController.postData);


export default router


