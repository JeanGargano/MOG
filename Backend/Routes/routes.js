//Endpoints de la Aplicación
import express from "express";
import {
  managerController,
  surveyController,
  comedorController,
} from "../Container.js";

//Enrutador
const router = express.Router();



//Endpoints Para Encuesta
router.get("/getForm", (req, res) => 
  surveyController.get_form(req, res)
);
router.post("/migrateData", (req, res) =>
  surveyController.migrate_surveys(req, res),
);
router.get("/downloadExcel", (req, res) =>
  surveyController.download_excel(req, res),
);




//Endpoints Para Encargado
router.get("/getEncargado", (req, res) =>
  managerController.find_by_identification(req, res),
);
router.post("/crearEncargado", (req, res) =>
  managerController.create_manager(req, res),
);
router.post("/agregarCampos", (req, res) =>
  managerController.add_fields(req, res),
);
router.post("/login", (req, res) =>
  managerController.login_manager(req, res),
);





//Endpoints para Comedor
router.post("/crear_comedor", (req, res) =>
  comedorController.post_comedor(req, res),
);
router.get("/listar_comedores", (req, res) =>
  comedorController.find_comedores(req, res),
);
router.post("/listar_comedor_Id", (req, res) =>
  comedorController.get_comedores_by_ids(req, res),
);
router.post("/listar_comedor_nombre", (req, res) =>
  comedorController.find_comedores_by_name(req, res),
);

export default router;
