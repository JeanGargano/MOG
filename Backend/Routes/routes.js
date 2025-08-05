//Endpoints de la Aplicación
import express from "express";
import {
  encargadoController,
  encuestaController,
  comedorController,
} from "../Container.js";

//Enrutador
const router = express.Router();

//Endpoints Para Encuesta
router.get("/getForm", async (req, res) => {
  const name = req.query.name;
  const data = await encuestaController.getForm(name);
  res.json(data);
});
router.get("/getFormFromCache", async (req, res) => {
  const name = req.query.name;
  const data = await encuestaController.getFormFromCache(name);
  res.json(data);
});
router.post("/guardarRespuestaEnArchivo", (req, res) =>
  encuestaController.guardarRespuestasEnArchivo(req, res),
);
router.post("/migrateData", (req, res) =>
  encuestaController.migrateData(req, res),
);

//Endpoints Para Encargado
router.get("/getEncargado", (req, res) =>
  encargadoController.findByIdentificacion(req, res),
);
router.post("/crearEncargado", (req, res) =>
  encargadoController.postEncargado(req, res),
);
router.post("/agregarCampos", (req, res) =>
  encargadoController.agregarCampos(req, res),
);
router.post("/login", (req, res) =>
  encargadoController.logearEncargado(req, res),
);

//Endpoints para Comedor
router.post("/crear_comedor", (req, res) =>
  comedorController.postComedor(req, res),
);
router.get("/listar_comedores", (req, res) =>
  comedorController.findComedores(req, res),
);
router.post("/listar_comedor_Id", (req, res) =>
  comedorController.getComedoresByIds(req, res),
);
router.post("/listar_comedor_nombre", (req, res) =>
  comedorController.findComedoresByName(req, res),
);

export default router;
