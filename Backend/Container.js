// File responsible for creating and wiring application instances (Dependency Injection)
// Import Repository, Service and Controller classes
import { ManagerRepository } from "./repository/ManagerRepository.js";
import { ManagerService } from "./service/ManagerService.js";
import { ManagerController } from "./controller/ManagerController.js";

import { SurveyRepository } from "./repository/SurveyRepository.js";
import { SurveyService } from "./service/SurveyService.js";
import { SurveyController } from "./controller/SurveyController.js";

import { ComedorRepository } from "./repository/ComedorRespository.js";
import { ComedorService } from "./service/ComedorService.js";
import { ComedorController } from "./controller/ComedorController.js";


const managerRepository = new ManagerRepository();
const surveyRepository = new SurveyRepository();
const comedorRespository = new ComedorRepository();

const managerService = new ManagerService(managerRepository);
const surveyService = new SurveyService(surveyRepository);
const comedorService = new ComedorService(comedorRespository);

const managerController = new ManagerController(managerService);
const surveyController = new SurveyController(surveyService);
const comedorController = new ComedorController(comedorService);


export {
  managerController,
  surveyController,
  comedorController
};
