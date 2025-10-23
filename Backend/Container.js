// File responsible for creating and wiring application instances (Dependency Injection)

// Import Repository, Service and Controller classes
import { ManagerRepository } from './Repository/ManagerRepository.js';
import { ManagerService } from './Service/ManagerService.js';
import { ManagerController } from './Controller/ManagerController.js';

import { SurveyRepository } from './Repository/SurveyRepository.js';
import { SurveyService } from './Service/SurveyService.js';
import { SurveyController } from './Controller/SurveyController.js';

import { ComedorRepository } from './Repository/ComedorRespository.js';
import { ComedorService } from './Service/ComedorService.js';
import { ComedorController } from './Controller/ComedorController.js';

/**
 * Instantiate Repositories
 * Repositories handle data persistence and interaction with MongoDB.
 */
const managerRepository = new ManagerRepository();
const surveyRepository = new SurveyRepository();
const comedorRespository = new ComedorRepository();

/**
 * Instantiate Services with injected Repositories
 * Services contain business logic and act as an intermediate layer.
 */
const managerService = new ManagerService(managerRepository);
const surveyService = new SurveyService(surveyRepository);
const comedorService = new ComedorService(comedorRespository);

/**
 * Instantiate Controllers with injected Services
 * Controllers handle HTTP requests and responses.
 */
const managerController = new ManagerController(managerService);
const surveyController = new SurveyController(surveyService);
const comedorController = new ComedorController(comedorService);

/**
 * Export final instances for use in routing configuration
 */
export {
  managerController,
  surveyController,
  comedorController
};
