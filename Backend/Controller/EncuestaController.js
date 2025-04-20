//Clase de controladores para Encuesta
import { error } from "console";
import { EncuestaService } from "../Service/EncuestaService.js";
import axios from "axios";

export default class EncuestaController {

    //Migrar a la base de datos
    static async postData(req, res) {
        try {
            const result = await EncuestaService.migrarEncuestasDesdeArchivo();
    
            if (result.error) {
                return res.status(result.status || 400).json({ error: result.error });
            }
    
            res.status(result.status || 200).json({
                message: result.message,
                cantidad: result.cantidad 
            });
        } catch (error) {
            console.error("Error en EncuestaController:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    

    //Escribir respuestas en archivo
    static async writeData(req, res) {
        try{
            const result = await EncuestaService.guardarRespuestasEnArchivo(req.body);
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


    //Obtener Formualario
    static async getForm(name) {
        try {
            const response = await axios.get(
                "https://script.google.com/macros/s/AKfycbwwYUe_KCzLNFBKryXKSB-IV7t722-9OgUsETpt-2z3kN4Rd5tvwnW4CxzCnuY5_ihTPA/exec",
                {
                    params: {name}
                }
            );
            const form = response.data;
            const result = await EncuestaService.writeData(form);
            if (result.error) {
                return res.status(result.status).json({ error: result.error });
            } else {
                return form;
            }
        } catch (error) {
            console.error("❌ Error al obtener el formulario:", error);
        }
    }

    //Obtener Formulario desde archivo
    static async getFormFromCache(name) {
        const cachedData = await EncuestaService.loadData(name);
            if (cachedData) {
                console.warn("⚠️ Modo offline: usando datos guardados del formulario" + {name});
                return cachedData;
            } else {
                throw new Error("No se pudieron obtener los datos en cache del formulario" + (name));
            }
    }
    
}

