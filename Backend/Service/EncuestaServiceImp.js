import path from "path";
import { fileURLToPath } from "url";
import { appendFile } from "fs/promises";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas de los archivos para guardar en local
const archivoRespuestas = path.join(__dirname, "..", "Respuestas.json");
const archivoFormularios = path.join(__dirname, "..", "Formularios.json");

export class EncuestaService {
  constructor(encuestaRepository) {
    this.encuestaRepository = encuestaRepository;
  }

  //Metodo para escribir respuestas en archivo
  async guardarRespuestasEnArchivo(data) {
    try {
      const linea = JSON.stringify(data) + "\n"; // Agrega salto de línea para JSONL
      await appendFile(archivoRespuestas, linea);
      console.log("✅ Respuesta guardada como línea individual");
      return { success: true };
    } catch (err) {
      console.error("❌ Error al guardar en archivo:", err.message);
      throw err;
    }
  }

    //Metodo para guardar respuestas en archivo
    async guardarRespuestasEnArchivo(nuevoEncuestado) {
      try {
        let contenido = await readFile(archivoRespuestas, 'utf-8');
        let json;
    
        // Si el archivo está vacío, inicializamos el array con el nuevo encuestado
        if (contenido.trim() === '') {
          json = [{
            nombre: nuevoEncuestado.nombre,
            id_formulario: nuevoEncuestado.id_formulario,
            Realizaciones: nuevoEncuestado.Realizaciones
          }];
        } else {
          json = JSON.parse(contenido);
          
          // Buscar si ya existe una encuesta con el mismo nombre
          const encuestaExistente = json.find(encuesta =>
            encuesta.nombre === nuevoEncuestado.nombre && encuesta.id_formulario === nuevoEncuestado.id_formulario
          );
          
          if (encuestaExistente) {
            // Si existe la encuesta, agregar las realizaciones
            for (const nuevaRealizacion of nuevoEncuestado.Realizaciones) {
              const realizacionExistente = encuestaExistente.Realizaciones.find(r =>
                r.id_encargado === nuevaRealizacion.id_encargado &&
                r.id_comedor === nuevaRealizacion.id_comedor
              );
        
              if (realizacionExistente) {
                // Agregar encuestados si no existen
                for (const encuestado of nuevaRealizacion.encuestados) {
                  const yaExiste = realizacionExistente.encuestados.some(e =>
                    e.nombreCompleto === encuestado.nombreCompleto &&
                    e.fechaRealizacion === encuestado.fechaRealizacion
                  );
                  if (!yaExiste) {
                    realizacionExistente.encuestados.push(encuestado);
                  }
                }
              } else {
                // Si no existe la realización, agregarla
                encuestaExistente.Realizaciones.push(nuevaRealizacion);
              }
            }
          } else {
            // Si no existe la encuesta, agregarla completamente
            json.push({
              nombre: nuevoEncuestado.nombre,
              id_formulario: nuevoEncuestado.id_formulario,
              Realizaciones: nuevoEncuestado.Realizaciones
            });
          }
        }
    
        // Escribir el archivo con el nuevo formato
        const nuevaLinea = JSON.stringify(json, null, 2) + '\n';
        await writeFile(archivoRespuestas, nuevaLinea);
    
        console.log("Formulario actualizado con éxito");
        return { success: true };
      } catch (err) {
        console.error("Error al guardar el formulario", err.message);
        throw err;
      }
    }
    
    
    //Metodo para migrar respuestas a la Base de datos
    async migrarEncuestasDesdeArchivo() {
      try {
        // Leer el archivo con las encuestas
        const fileContent = await readFile(archivoRespuestas, 'utf-8');
        const encuestas = JSON.parse(fileContent); // Parsear el JSON correctamente
    
        if (encuestas.length === 0) {
          console.log('📭 No hay encuestas por migrar.');
          return { status: 'No hay encuestas para migrar' };
        }
    
        const resultados = [];
    
        // Iterar sobre cada encuesta en el archivo
        for (const encuesta of encuestas) {
          const encuestaSeparada = {
            nombre: encuesta.nombre,
            id_formulario: encuesta.id_formulario,
            Realizaciones: encuesta.Realizaciones // Guardar realizaciones
          };
    
          // Guardar la encuesta como un documento
          const result = await this.encuestaRepository.save(encuestaSeparada);
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
      // Limpia el archivo después de migrar
      await writeFile(archivoRespuestas, "");
      console.log(
        `✅ ${resultados.length} encuestas migradas y archivo limpio`,
      );
      return { status: "Migración completada", cantidad: resultados.length };
    } catch (err) {
      console.error("❌ Error al migrar encuestas:", err.message);
      throw err;
    }

  //Metodo para cargar los Formularios desde el archivo
  async loadData() {
    if (fs.existsSync(archivoFormularios)) {
      return JSON.parse(fs.readFileSync(archivoFormularios, "utf8"));
    }
    return null;
  }
}


