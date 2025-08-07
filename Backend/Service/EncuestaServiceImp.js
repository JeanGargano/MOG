import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";
import fs from "fs";
import ExcelJS from "exceljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const archivoRespuestas = path.join(__dirname, "..", "Respuestas.json");
const archivoFormularios = path.join(__dirname, "..", "Formularios.json");
const filePath = path.join(__dirname, "..", "encuesta.xlsx");

export class EncuestaService {
  constructor(encuestaRepository) {
    this.encuestaRepository = encuestaRepository;
  }

  //Metodo para guardar respuestas en archivo
  async guardarRespuestasEnArchivo(nuevoEncuestado) {
    try {
      let contenido = await readFile(archivoRespuestas, "utf-8");
      let json;
      // Si el archivo está vacío, inicializamos el array con el nuevo encuestado
      if (contenido.trim() === "") {
        json = [
          {
            nombre: nuevoEncuestado.nombre,
            id_formulario: nuevoEncuestado.id_formulario,
            Realizaciones: nuevoEncuestado.Realizaciones,
          },
        ];
      } else {
        json = JSON.parse(contenido);
        // Buscar si ya existe una encuesta con el mismo nombre
        const encuestaExistente = json.find(
          (encuesta) =>
            encuesta.nombre === nuevoEncuestado.nombre &&
            encuesta.id_formulario === nuevoEncuestado.id_formulario,
        );
        if (encuestaExistente) {
          // Si existe la encuesta, agregar las realizaciones
          for (const nuevaRealizacion of nuevoEncuestado.Realizaciones) {
            const realizacionExistente = encuestaExistente.Realizaciones.find(
              (r) =>
                r.id_encargado === nuevaRealizacion.id_encargado &&
                r.id_comedor === nuevaRealizacion.id_comedor,
            );
            if (realizacionExistente) {
              // Agregar encuestados si no existen
              for (const encuestado of nuevaRealizacion.encuestados) {
                const yaExiste = realizacionExistente.encuestados.some(
                  (e) =>
                    e.nombreCompleto === encuestado.nombreCompleto &&
                    e.fechaRealizacion === encuestado.fechaRealizacion,
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
            Realizaciones: nuevoEncuestado.Realizaciones,
          });
        }
      }
      // Escribir el archivo con el nuevo formato
      const nuevaLinea = JSON.stringify(json, null, 2) + "\n";
      await writeFile(archivoRespuestas, nuevaLinea);
      console.log("Formulario actualizado con éxito");
      return { success: true };
    } catch (err) {
      console.error("Error al guardar el formulario", err.message);
      throw err;
    }
  }

  //Metodo para migrar respuestas a la Base de datos
  async migrarEncuestasDesdeBody(encuestas) {
    try {
      if (!Array.isArray(encuestas) || encuestas.length === 0) {
        console.log("📭 No hay encuestas por migrar.");
        return { status: 400, error: "No hay encuestas para migrar" };
      }

      const resultados = [];

      for (const encuesta of encuestas) {
        const encuestaSeparada = {
          nombre: encuesta.nombre,
          id_formulario: encuesta.id_formulario,
          Realizaciones: encuesta.Realizaciones,
        };

        const result = await this.encuestaRepository.save(encuestaSeparada);
        resultados.push(result);
      }

      console.log(
        `✅ ${resultados.length} encuestas migradas desde el cuerpo del request`,
      );
      return {
        status: 200,
        message: "Migración completada",
        cantidad: resultados.length,
      };
    } catch (err) {
      console.error("❌ Error al migrar encuestas:", err.message);
      throw err;
    }
  }

  //Metodo para cargar los Formularios desde el archivo
  async loadData() {
    if (fs.existsSync(archivoFormularios)) {
      return JSON.parse(fs.readFileSync(archivoFormularios, "utf8"));
    }
    return null;
  }

  //Metodo que escribe los datos de un formulario en el archivo
  async writeData(data) {
    try {
      let formularios = [];
      if (fs.existsSync(archivoFormularios)) {
        const contenido = await readFile(archivoFormularios, "utf8");
        if (contenido.trim()) {
          try {
            formularios = JSON.parse(contenido);
            if (!Array.isArray(formularios)) {
              throw new Error(
                "El contenido del archivo no es un array válido.",
              );
            }
          } catch (parseErr) {
            console.error(
              "❌ Error al parsear Formulario.json:",
              parseErr.message,
            );
            throw new Error(
              "El archivo de formularios está dañado o no es JSON válido.",
            );
          }
        }
      }
      formularios.push(data);
      await writeFile(archivoFormularios, JSON.stringify(formularios, null, 2));
      console.log("📥 Formulario guardado con éxito");
      return { success: true };
    } catch (err) {
      console.error("❌ Error al guardar el formulario:", err.message);
      throw err;
    }
  }

  async convert_to_excel() {
    try {
      const contenido = await readFile(archivoRespuestas, "utf-8");
      if (!contenido.trim()) {
        throw new Error("El archivo de respuestas está vacío.");
      }

      const parsed = JSON.parse(contenido);
      const encuestas = Array.isArray(parsed) ? parsed : [parsed];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Encuesta');
      const allQuestions = new Set();
      for (const encuesta of encuestas) {
        for (const realizacion of encuesta.Realizaciones || []) {
          for (const encuestado of realizacion.encuestados || []) {
            for (const pregunta of encuestado.preguntas || []) {
              allQuestions.add(pregunta.pregunta);
            }
          }
        }
      }
      const baseColumns = [
        { header: "Nombre Encuesta", key: "nombre", width: 25 },
        { header: "ID Formulario", key: "id_formulario", width: 20 },
        { header: "ID Encargado", key: "id_encargado", width: 20 },
        { header: "ID Comedor", key: "id_comedor", width: 25 },
        { header: "Nombre Encuestado", key: "nombreCompleto", width: 25 },
        { header: "Fecha Realización", key: "fechaRealizacion", width: 20 },
      ];
      const questionColumns = Array.from(allQuestions).map(q => ({
        header: q,
        key: q,
        width: 30,
      }));
      worksheet.columns = [...baseColumns, ...questionColumns];
      for (const encuesta of encuestas) {
        for (const realizacion of encuesta.Realizaciones || []) {
          for (const encuestado of realizacion.encuestados || []) {
            const rowData = {
              nombre: encuesta.nombre,
              id_formulario: encuesta.id_formulario,
              id_encargado: realizacion.id_encargado,
              id_comedor: realizacion.id_comedor,
              nombreCompleto: encuestado.nombreCompleto,
              fechaRealizacion: encuestado.fechaRealizacion,
            };
            for (const pregunta of encuestado.preguntas || []) {
              rowData[pregunta.pregunta] = pregunta.respuesta;
            }
            worksheet.addRow(rowData);
          }
        }
      }
      await workbook.xlsx.writeFile(filePath);
      console.log("✅ Archivo Excel generado:", filePath);
      return filePath;
    } catch (err) {
      console.error("❌ Error al exportar encuestas a Excel:", err.message);
      throw err;
    }
  }

}
