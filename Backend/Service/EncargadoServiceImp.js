// Services/EncargadoService.js

export class EncargadoService {
    constructor(encargadoRepository) {
        this.encargadoRepository = encargadoRepository;
    }
    
    async autenticarEncargado(name, contraseña) {
        console.log(name);
        const encargado = await this.encargadoRepository.findByName(name);
        if (!encargado) {
            throw new Error("Encargado no encontrado");
        }
        return encargado;
    }

    async crearEncargado(name) {
        console.log(name);
        const result = await this.encargadoRepository.create(name);
        return result;
    }
}
