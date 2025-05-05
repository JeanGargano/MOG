//Clase de controladores para Encuesta
import axios from "axios";

export class EncuestaController {
  //Metodo constructor
  constructor(encuestaService) {
    this.encuestaService = encuestaService;
  }

  //Migrar Encuestas desde archivo
  async migrateData(req, res) {
    try {
      const result = await this.encuestaService.migrarEncuestasDesdeArchivo();

      if (result.error) {
        // Asegúrate que result.status sea un número, usa 400 por defecto si no existe
        return res.status(Number(result.status) || 400).json({
          error: result.error,
        });
      }
      // Usa 200 por defecto si result.status no es un número válido
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
        try{
            const result = await this.encuestaService.guardarRespuestasEnArchivo(req.body);
            if (result.error){
                return res.status(result.status).json({error: result.error});
            }else{
                return res.status(200).json({ message: "Se han escrito los datos correctamente" });
            }

        }
        catch (error){
            console.error("Error en EncuestaController", error)
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
}
