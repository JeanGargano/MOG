//Archivo para creacion de intancias
import { ManagerRepository } from './Repository/ManagerRepository.js';
import { ManagerService } from './Service/ManagerService.js';
import {ManagerController} from './Controller/ManagerController.js';
import { SurveyRepository } from './Repository/SurveyRepository.js';
import { SurveyService } from './Service/SurveyService.js';
import {SurveyController} from './Controller/SurveyController.js';
import { ComedorRepository } from './Repository/ComedorRespository.js';
import { ComedorService } from './Service/ComedorService.js';
import { ComedorController } from './Controller/ComedorController.js';

// Instanciar Repositorios
const managerRepository = new ManagerRepository();
const surveyRepository = new SurveyRepository();
const comedorRespository = new ComedorRepository();

// Instanciar Servicios inyectando Repositorios
const managerService = new ManagerService(managerRepository);
const surveyService = new SurveyService(surveyRepository);
const comedorService = new ComedorService(comedorRespository);

// Instanciar Controladores Inyectando Servicios
const managerController = new ManagerController(managerService);
const surveyController = new SurveyController(surveyService);
const comedorController = new ComedorController(comedorService);

// Exportar instancias
export {
  managerController,
  surveyController,
  comedorController
};
