//Clase de implementacio para los metodos de comedor
export class ComedorService {
  constructor(comedorRepository) {
    this.comedorRepository = comedorRepository;
  }

  //Crear comedor
  async postComedor(data) {
    if (!data.nombre || !data.pais) {
      throw new Error("Los campos 'nombre' y 'pais' son obligatorios");
    }
    return await this.comedorRepository.postComedor(data);
  }

  //Listar comedores
  async findComedores() {
    const comedores = await this.comedorRepository.findComedores();
    if (!comedores || comedores.length === 0) {
      throw new Error("No hay comedores registrados");
    }
    return comedores;
  }

  //Listar comedores por ID
  async findComedoresByIds(ids) {
    return await this.comedorRepository.findComedoresByIds(ids);
  }

  async findComedoresByName(name) {
    if (!name) {
      throw new Error("El campo 'name' es obligatorio");
    }
    return await this.comedorRepository.findComedoresByName(name);
  }
}
