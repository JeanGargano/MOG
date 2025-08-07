//Clase de controladores para Encuesta
import axios from "axios";
export class EncuestaController {
  //Metodo constructor
  constructor(encuestaService) {
    this.encuestaService = encuestaService;
  }

  async getForm(id) {
  try {
    const response = await axios.get(
      "https://script.google.com/macros/s/AKfycbyVnzIolY4YETpV1Fe4Jp3HYHT7397XnJ767nRua3Z7OWq4Y4JZRcUD_4OO5M42P3g3QA/exec",
      { params: { id } }
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
      const datos = req.body;

      const result = await this.encuestaService.migrarEncuestasDesdeBody(datos);

      if (result.error) {
        return res.status(Number(result.status) || 400).json({
          error: result.error,
        });
      }

      return res.status(Number(result.status) || 200).json({
        message: result.message || "Migración completada",
        cantidad: result.cantidad,
      });
    } catch (error) {
      console.error("Error en EncuestaController:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        detalles: error.message,
      });
    }
  }

  //Escribir respuestas en archivo
  async guardarRespuestasEnArchivo(req, res) {
    try {
      const result = await this.encuestaService.guardarRespuestasEnArchivo(
        req.body,
      );
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      } else {
        return res
          .status(200)
          .json({ message: "Se han escrito los datos correctamente" });
      }
    } catch (error) {
      console.error("Error en EncuestaController", error);
      res.status(500).json({ error: "Error interno del servidor" });
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
      res.download(filePath, 'encuesta.xlsx', (err) => {
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

}


