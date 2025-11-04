// Application Endpoints
import express from "express";
import {
  managerController,
  surveyController,
  comedorController,
} from "../Container.js"

// Router initialization
const router = express.Router();

/**
 * -----------------------------
 * Survey Endpoints
 * -----------------------------
 */

router.get("/get_form", (req, res) =>
  surveyController.get_form(req, res)
);


router.post("/migrate_surveys", (req, res) =>
  surveyController.migrate_surveys(req, res)
);


router.get("/download_excel", (req, res) =>
  surveyController.download_excel(req, res)
);





/**
 * -----------------------------
 * Manager Endpoints
 * -----------------------------
 */

router.get("/find_by_identification", (req, res) =>
  managerController.find_by_identification(req, res)
);


router.post("/create_manager", (req, res) =>
  managerController.create_manager(req, res)
);


router.post("/add_fields", (req, res) =>
  managerController.add_fields(req, res)
);


router.post("/login_manager", (req, res) =>
  managerController.login_manager(req, res)
);




/**
 * -----------------------------
 * Comedor Endpoints
 * -----------------------------
 */


router.post("/post_comedor", (req, res) =>
  comedorController.post_comedor(req, res)
);


router.get("/find_comedores", (req, res) =>
  comedorController.find_comedores(req, res)
);


router.post("/find_comedores_by_ids", (req, res) =>
  comedorController.find_comedores_by_ids(req, res)
);



router.post("/find_comedores_by_name", (req, res) =>
  comedorController.find_comedores_by_name(req, res)
);


export default router;
