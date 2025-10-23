// Application Endpoints
import express from "express";
import {
  managerController,
  surveyController,
  comedorController,
} from "../Container.js";

// Router initialization
const router = express.Router();

/**
 * -----------------------------
 * Survey Endpoints
 * -----------------------------
 */

/**
 * GET /get_form
 * Retrieves the form configuration or structure for a survey.
 */
router.get("/get_form", (req, res) =>
  surveyController.get_form(req, res)
);

/**
 * POST /migrate_surveys
 * Migrates existing survey data into the system/database.
 */
router.post("/migrate_surveys", (req, res) =>
  surveyController.migrate_surveys(req, res)
);

/**
 * GET /download_excel
 * Generates and downloads survey reports in Excel format.
 */
router.get("/download_excel", (req, res) =>
  surveyController.download_excel(req, res)
);





/**
 * -----------------------------
 * Manager Endpoints
 * -----------------------------
 */

/**
 * GET /find_by_identification
 * Finds a manager by their identification number or document ID.
 */
router.get("/find_by_identification", (req, res) =>
  managerController.find_by_identification(req, res)
);

/**
 * POST /create_manager
 * Creates a new manager record in the system.
 */
router.post("/create_manager", (req, res) =>
  managerController.create_manager(req, res)
);

/**
 * POST /add_fields
 * Adds additional fields or attributes to a manager record.
 */
router.post("/add_fields", (req, res) =>
  managerController.add_fields(req, res)
);

/**
 * POST /login_manager
 * Handles login authentication for managers.
 */
router.post("/login_manager", (req, res) =>
  managerController.login_manager(req, res)
);




/**
 * -----------------------------
 * Comedor Endpoints
 * -----------------------------
 */

/**
 * POST /post_comedor
 * Creates a new dining hall record.
 */
router.post("/post_comedor", (req, res) =>
  comedorController.post_comedor(req, res)
);

/**
 * GET /find_comedores
 * Retrieves a list of all dining halls registered in the system.
 */
router.get("/find_comedores", (req, res) =>
  comedorController.find_comedores(req, res)
);

/**
 * POST /get_comedores_by_ids
 * Retrieves dining halls by specific ID(s).
 */
router.post("/get_comedores_by_ids", (req, res) =>
  comedorController.get_comedores_by_ids(req, res)
);


/**
 * POST /find_comedores_by_name
 * Searches dining halls by name.
 */
router.post("/find_comedores_by_name", (req, res) =>
  comedorController.find_comedores_by_name(req, res)
);

export default router;
