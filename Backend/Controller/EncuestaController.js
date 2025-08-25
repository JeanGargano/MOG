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
      "https://script.google.com/macros/s/AKfycbzWlPfm4hx1CIfgY1xNNwkEZkhnJVL8CazEMv1yEPakD5ayeXEDCmdIsCjLcOemXrhDQA/exec",
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
    const encuesta = req.body;
    
    const result = await this.encuestaService.migrar_encuestas(encuesta);

    if (result.error) {
      return res.status(Number(result.status) || 400).json({
        error: result.error,
      });
    }

    this.encuestaService.guardarRespuestasEnArchivo(encuesta)
      .then(result => {
        console.log("Respuestas guardadas localmente", result);
      })
      .catch(err => {
        console.error("Error al guardar respuestas localmente", err);
      });


    this.encuestaService.convert_to_excel()
      .then(filePath => {
        console.log("Excel generado en:", filePath);
      })
      .catch(err => {
        console.error("Error al generar Excel:", err);
      });

    return res.status(Number(result.status) || 200).json({
      message: result.message || "Migración completada",
      cantidad: result.cantidad,
      aviso: "El archivo Excel se está generando en background"
    });

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

}


