//Clase de controladores para Encuesta
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
export class EncuestaController {
  //Metodo constructor
  constructor(encuestaService) {
    this.encuestaService = encuestaService;
  }

  // Endpoint para limpiar formularios (sign out)
  async signOut(req, res) {
    try {
      const result = await this.encuestaService.clearFormularios();
      return res
        .status(Number(result.status) || 200)
        .json({ message: result.message });
    } catch (err) {
      console.error("Error en signOut:", err);
      return res
        .status(500)
        .json({ error: "Error interno al limpiar formularios" });
    }
  }

  // helper para __dirname en ES modules
  static __dirname() {
    return path.dirname(fileURLToPath(import.meta.url));
  }

  async getForm(id) {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbwN76byYy3cpuzT64hKAw_YbrU51Pt5D6F8wpfslYYen-CPD6G5W9vx3OhgFIHXHvA0KA/exec",
        { params: { id } },
      );

      const form = response.data;
      console.log(form);

      if (form.error) {
        console.error("Error desde el servidor Apps Script:", form.error);
        return { error: form.error, status: 404 };
      }

      const result = await this.encuestaService.writeData(form);
      return form;
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
      return { error: error.message, status: 500 };
    }
  }

  //Migrar Encuestas desde archivo
  async migrateData(req, res) {
    try {
      // Recibir respuestas desde el body (no se guardan en local)
      const encuesta = req && req.body;

      if (
        !encuesta ||
        (encuesta &&
          Object.keys(encuesta).length === 0 &&
          encuesta.constructor === Object)
      ) {
        return res.status(400).json({
          error: "No se recibieron respuestas en el body de la solicitud",
        });
      }

      // Guardar en la base de datos mediante el servicio
      const result = await this.encuestaService.migrar_encuestas(encuesta);

      if (result.error) {
        return res
          .status(Number(result.status) || 400)
          .json({ error: result.error });
      }

      // Generar Excel para las encuestas que se migraron y esperar a que termine
      const nombreEncuesta =
        Array.isArray(encuesta) && encuesta[0] && encuesta[0].nombre
          ? encuesta[0].nombre
          : encuesta.nombre || "encuesta";
      try {
        const filePath = await this.encuestaService.convert_to_excel(
          encuesta,
          nombreEncuesta,
        );
        // Construir una URL de descarga relativa al backend (router montado en '/')
        const fileName = filePath.split(/[\\\/]/).pop();
        const downloadUrl = `/downloadExcel?file=${encodeURIComponent(fileName)}`;
        return res.status(Number(result.status) || 200).json({
          message: result.message || "Migración completada",
          cantidad: result.cantidad,
          downloadUrl,
        });
      } catch (err) {
        console.error("Error al generar Excel:", err);
        return res
          .status(500)
          .json({ error: "Error al generar el archivo Excel" });
      }
    } catch (error) {
      console.error("Error en EncuestaController:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        detalles: error.message,
      });
    }
  }

  //Obtener formularios desde archivo
  async getFormFromCache(name) {
    const cachedData = await this.encuestaService.loadData();
    if (cachedData) {
      console.warn(
        "⚠️ Modo offline: usando datos guardados del formulario" + name,
      );
      return cachedData;
    } else {
      throw new Error(
        "No se pudieron obtener los datos en cache del formulario" + name,
      );
    }
  }
  async covert_to_excel(req, res) {
    try {
      const filePath = await this.encuestaService.convert_to_excel();
      res.download(filePath, "encuesta.xlsx", (err) => {
        if (err) {
          console.error("❌ Error al enviar el archivo:", err);
          res.status(500).json({ error: "Error al descargar el archivo" });
        } else {
          console.log("📥 Archivo descargado exitosamente");
        }
      });
    } catch (error) {
      console.error("❌ Error en EncuestaController:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Servir archivos Excel desde la carpeta downloads
  downloadExcel(req, res) {
    try {
      const file = req.query.file;
      if (!file)
        return res.status(400).json({ error: "Falta el parámetro file" });
      const downloadsPath = path.join(
        EncuestaController.__dirname(),
        "..",
        "downloads",
      );
      const fullPath = path.join(downloadsPath, file);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
      }
      // Exponer header Content-Disposition para que fetch en el front pueda leerlo
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      res.download(fullPath, file, (err) => {
        if (err) {
          console.error("Error al enviar el archivo:", err);
          // Si hubo un error al enviar, no intentar borrar el archivo
          try {
            return res
              .status(500)
              .json({ error: "Error al enviar el archivo" });
          } catch (e) {
            console.error("Error al enviar respuesta de error:", e);
            return;
          }
        }

        // Si la descarga terminó sin errores, intentar borrar el archivo generado
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              "No se pudo eliminar el archivo tras descarga:",
              unlinkErr,
            );
          } else {
            console.log("Archivo eliminado tras descarga:", fullPath);
          }
        });
      });

      // Borrado de respaldo: eliminar el archivo después de 15 minutos si todavía existe
      setTimeout(
        () => {
          if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(
                  "Error al eliminar archivo en limpieza programada:",
                  unlinkErr,
                );
              } else {
                console.log(
                  "Archivo eliminado por limpieza programada:",
                  fullPath,
                );
              }
            });
          }
        },
        1000 * 60 * 15,
      ); // 15 minutos
    } catch (err) {
      console.error("Error en downloadExcel:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
