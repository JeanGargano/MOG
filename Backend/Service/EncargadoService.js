// Services/EncargadoService.js
import { EncargadoRepository } from "../Repository/EncargadoRepository.js";

const repo = new EncargadoRepository();
export class EncargadoService {
    
    static async getEncargado(name) {
        console.log(name)
        const encargado = await repo.findByName(name);
        if (!encargado) {
        throw new Error("Encargado no encontrado");
        }
        return encargado;
    }


}
