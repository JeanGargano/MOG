import path from 'path';
import { fileURLToPath } from 'url';
import { appendFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas de los archivos para guardar en local
const archivoRespuestas = path.join(__dirname, '..', 'Respuestas.json');
const archivoFormularios = path.join(__dirname, '..', 'Formularios.json');


export class EncuestaService {

    constructor(encuestaRepository){
      this.encuestaRepository = encuestaRepository;
    }

    //Metodo para escribir respuestas en archivo
    async guardarRespuestasEnArchivo(data) {
        try {
          const linea = JSON.stringify(data) + '\n'; // Agrega salto de línea para JSONL
          await appendFile(archivoRespuestas, linea);
          console.log('✅ Respuesta guardada como línea individual');
          return { success: true };
        }catch (err) {
          console.error('❌ Error al guardar en archivo:', err.message);
          throw err;
        }
      }

    //Metodo para migrar respuestas a la Base de datos
    async migrarEncuestasDesdeArchivo() {
        try {
          const fileContent = await readFile(archivoRespuestas, 'utf-8');
          const lineas = fileContent.trim().split('\n').filter(line => line.length > 0);
      
          if (lineas.length === 0) {
            console.log('📭 No hay encuestas por migrar.');
            return { status: 'No hay encuestas para migrar' };
          }
      
          const resultados = [];
          for (const linea of lineas) {
            const encuesta = JSON.parse(linea);
            const result = await this.encuestaRepository.save(encuesta);
            resultados.push(result);
          }
          // Limpia el archivo después de migrar
          await writeFile(archivoRespuestas, '');
          console.log(`✅ ${resultados.length} encuestas migradas y archivo limpio`);
          return { status: 'Migración completada', cantidad: resultados.length };
        } catch (err) {
          console.error('❌ Error al migrar encuestas:', err.message);
          throw err;
        }
      }
      

    //Metodo para escribir encuesta en archivos
    async writeData(data) {
      try {
        const linea = JSON.stringify(data) + '\n';
        await appendFile(archivoFormularios, linea);
        console.log("Formulario guardado con éxito");
        return { success: true };
      } catch (err) {
        console.error("Error al guardar el formulario", err.message);
        throw err;
      }
    }
    
    //Metodo para cargar los Formularios desde el archivo
    async loadData () {
        if (fs.existsSync(archivoFormularios)) {
          return JSON.parse(fs.readFileSync(archivoFormularios, "utf8"));
        }
        return null;
      };

    }

