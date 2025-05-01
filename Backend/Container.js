//Archivo para creacion de intancias
import { EncargadoRepository } from './Repository/EncargadoRepository.js';
import { EncargadoService } from './Service/EncargadoServiceImp.js';
import {EncargadoController} from './Controller/EncargadoController.js';
import {EncuestaController} from './Controller/EncuestaController.js';
import { EncuestaRepository } from './Repository/EncuestaRepository.js';
import { EncuestaService } from './Service/EncuestaServiceImp.js';

// Instanciar Repositorios
const encargadoRepository = new EncargadoRepository();
const encuestaRepository = new EncuestaRepository();

// Instanciar Servicios inyectando Repositorios
const encargadoService = new EncargadoService(encargadoRepository);
const encuestaService = new EncuestaService(encuestaRepository);

// Instanciar Controladores Inyectando Servicios
const encargadoController = new EncargadoController(encargadoService);
const encuestaController = new EncuestaController(encuestaService);

// Exportar instancias
export {
  encargadoController,
  encuestaController
};
