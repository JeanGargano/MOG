//Clase de implementacion para los metodos de encargado
import bcrypt from "bcrypt";

export class EncargadoService {
  constructor(encargadoRepository) {
    this.encargadoRepository = encargadoRepository;
  }

  //Metodo para encontrar encaragdo por identificacion
  async findByIdentificacion(identificacion) {
    if (!identificacion) {
      throw new Error("Identificación inválida");
    }
    const encargado =
      await this.encargadoRepository.findByIdentificacion(identificacion);
    if (!encargado) {
      throw new Error("Encargado no encontrado");
    }
    return encargado;
  }

  //Metodo para crear encargado
  async postEncargado(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Datos inválidos para crear encargado");
    }

    const encargadoExistente =
      await this.encargadoRepository.findByIdentificacion(data.identificacion);
    if (encargadoExistente) {
      throw new Error("Ya existe un encargado con esta identificación");
    }

    const camposRequeridos = ["identificacion", "nombreCompleto", "comedores"];
    for (const campo of camposRequeridos) {
      if (!data[campo]) {
        throw new Error(`Falta el campo requerido: ${campo}`);
      }
    }

    if (data.contraseña) {
      if (typeof data.contraseña !== "string" || data.contraseña.length < 4) {
        throw new Error("La contraseña debe tener al menos 4 caracteres");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.contraseña, salt);
      data.contraseña = hashedPassword;
    }

    const encargado = await this.encargadoRepository.postEncargado(data);
    if (!encargado) {
      throw new Error("No se pudo crear el encargado");
    }
    return encargado;
  }

  //Metodo para agregar los nuevos campos a un encargado
  async agregarCampos(identificacion, nuevosCampos) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Identificación inválida");
    }
    if (!nuevosCampos || typeof nuevosCampos !== "object") {
      throw new Error("Los nuevos campos deben ser un objeto");
    }
    const plainPassword = nuevosCampos.contraseña;
    if (plainPassword) {
      if (typeof plainPassword !== "string" || plainPassword.length <= 4) {
        throw new Error(
          "La nueva contraseña debe ser una cadena válida de al menos 4 caracteres",
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      nuevosCampos.contraseña = hashedPassword;
    }
    const actualizado = await this.encargadoRepository.agregarCampos(
      identificacion,
      nuevosCampos,
    );
    if (!actualizado) {
      throw new Error("No se pudieron añadir los campos");
    }
    return actualizado;
  }

  //Metodo para logear un encargado
  async logearEncargado({ identificacion, contraseña }) {
    if (!identificacion || typeof identificacion !== "number") {
      throw new Error("Identificación inválida");
    }
    if (!contraseña || typeof contraseña !== "string") {
      throw new Error("Contraseña inválida");
    }
    const encargado =
      await this.encargadoRepository.findByIdentificacion(identificacion);
    if (!encargado) {
      throw new Error("Identificación no encontrada en el sistema");
    }
    const validPassword = await bcrypt.compare(
      contraseña,
      encargado.contraseña,
    );
    if (!validPassword) {
      throw new Error("Contraseña incorrecta");
    }
    return { message: "Login exitoso", encargado };
  }
}
