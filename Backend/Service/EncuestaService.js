import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { EncuestaRepository } from '../Repository/EncuestaRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas a los archivos
const archivoRespuestas = path.join(__dirname, '..', 'Respuestas.json');
const archivoFormularios = path.join(__dirname, '..', 'Formularios.json');

const encuestaRepo = new EncuestaRepository();

export class EncuestaService {

    //Metodo para escribir respuestas en archivo
    static async guardarRespuestasEnArchivo(data) {
        try {
          const linea = JSON.stringify(data) + '\n'; // Agrega salto de línea para JSONL
          await fs.appendFile(archivoRespuestas, linea);
          console.log('✅ Respuesta guardada como línea individual');
          return { success: true };
        }catch (err) {
          console.error('❌ Error al guardar en archivo:', err.message);
          throw err;
        }
      }


    //Metodo para migrar respuestas a la Base de datos
    static async migrarEncuestasDesdeArchivo() {
        try {
          const fileContent = await fs.readFile(archivoRespuestas, 'utf-8');
          const lineas = fileContent.trim().split('\n').filter(line => line.length > 0);
      
          if (lineas.length === 0) {
            console.log('📭 No hay encuestas por migrar.');
            return { status: 'No hay encuestas para migrar' };
          }
      
          const resultados = [];
          for (const linea of lineas) {
            const encuesta = JSON.parse(linea);
            const result = await encuestaRepo.save(encuesta);
            resultados.push(result);
          }
          // Limpia el archivo después de migrar
          await fs.writeFile(archivoRespuestas, '');
          console.log(`✅ ${resultados.length} Archivo limpio`);
          return { status: 'Migración completada', cantidad: resultados.length };
        } catch (err) {
          console.error('❌ Error al migrar encuestas:', err.message);
          throw err;
        }
      }
      

    /*
    static async postData(data) {
      try {
        const { nombre, encargadoId, comedorId, encuestados } = data;
  
        if (!nombre || !encargadoId || !comedorId || !encuestados) {
          return { error: "Faltan datos requeridos", status: 400 };
        }
  
        const encuesta = {
          fecha: new Date(),
          nombre,
          encargadoId,
          comedorId,
          encuestados: encuestados.map(e => ({
            nombreCompleto: e.nombreCompleto,
            nacionalidad: e.nacionalidad,
            edad: e.edad,
            ciudad: e.ciudad,
            localidad: e.localidad,
            estrato: e.estrato,
            preguntas: e.preguntas.map(p => ({
              pregunta: p.pregunta,
              respuesta: p.respuesta
            }))
          }))
        };
  
        const newData = await encuestaRepo.save(encuesta);
        return { success: true, data: newData };
      } catch (error) {
        console.error("Error en EncuestaService:", error);
        return { error: error.message, status: 500 };
      }
    }
    */
      

    //Metodo para escribir encuesta en archivos
    static async writeData (data) {
            fs.writeFileSync(archivoFormularios, JSON.stringify(data, null, 2));
            return("Datos escritos con exito")
          };

    
    //Metodo para cargar los datos desde el archivo
    static async loadData () {
        if (fs.existsSync(archivoFormularios)) {
          return JSON.parse(fs.readFileSync(archivoFormularios, "utf8"));
        }
        return null;
      };

    }

