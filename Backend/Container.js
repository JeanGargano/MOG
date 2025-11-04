// File responsible for creating and wiring application instances (Dependency Injection)
// Import Repository, Service and Controller classes
import { ManagerRepository } from "./Repository/ManagerRepository.js";
import { ManagerService } from "./Service/ManagerService.js";
import { ManagerController } from "./Controller/ManagerController.js";

import { SurveyRepository } from "./Repository/SurveyRepository.js";
import { SurveyService } from "./Service/SurveyService.js";
import { SurveyController } from "./Controller/SurveyController.js";

import { ComedorRepository } from "./Repository/ComedorRespository.js";
import { ComedorService } from "./Service/ComedorService.js";
import { ComedorController } from "./Controller/ComedorController.js";


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
