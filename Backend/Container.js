//Archivo para creacion de intancias
import { EncargadoRepository } from './Repository/EncargadoRepository.js';
import { EncargadoService } from './Service/EncargadoServiceImp.js';
import {EncargadoController} from './Controller/EncargadoController.js';
import { EncuestaRepository } from './Repository/EncuestaRepository.js';
import { EncuestaService } from './Service/EncuestaServiceImp.js';
import {EncuestaController} from './Controller/EncuestaController.js';
import { ComedorRepository } from './Repository/ComedorRespository.js';
import { ComedorService } from './Service/ComedorServiceImp.js';
import { ComedorController } from './Controller/ComedorController.js';

// Instanciar Repositorios
const encargadoRepository = new EncargadoRepository();
const encuestaRepository = new EncuestaRepository();
const comedorRespository = new ComedorRepository();

// Instanciar Servicios inyectando Repositorios
const encargadoService = new EncargadoService(encargadoRepository);
const encuestaService = new EncuestaService(encuestaRepository);
const comedorService = new ComedorService(comedorRespository);

// Instanciar Controladores Inyectando Servicios
const encargadoController = new EncargadoController(encargadoService);
const encuestaController = new EncuestaController(encuestaService);
const comedorController = new ComedorController(comedorService);

// Exportar instancias
export {
  encargadoController,
  encuestaController,
  comedorController
};
