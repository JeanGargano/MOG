import { ComedorService } from "../../service/ComedorService.js";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("ComedorService", () => {
  let comedorRepositoryMock;
  let comedorService;

  beforeEach(() => {
    comedorRepositoryMock = {
      post_comedor: jest.fn(),
      find_comedores: jest.fn(),
      find_comedores_by_ids: jest.fn(),
      find_comedores_by_name: jest.fn(),
    };

    comedorService = new ComedorService(comedorRepositoryMock);
  });
  

  // --- POST_COMEDOR ---
  test("post_comedor debe crear un comedor exitosamente", async () => {
    const data = { nombre: "Comedor Central", pais: "Colombia" };
    const fakeComedor = { id: 1, ...data };
    comedorRepositoryMock.post_comedor.mockResolvedValue(fakeComedor);

    const result = await comedorService.post_comedor(data);

    expect(comedorRepositoryMock.post_comedor).toHaveBeenCalledWith(data);
    expect(result).toEqual(fakeComedor);
  });

  test("post_comedor debe lanzar error si faltan campos requeridos", async () => {
    const data = { nombre: "Comedor sin país" };

    await expect(comedorService.post_comedor(data))
      .rejects
      .toThrow("The fields 'nombre' and 'pais' are required");
  });


  // --- FIND_COMEDORES ---
  test("find_comedores debe devolver lista de comedores", async () => {
    const comedores = [{ nombre: "Comedor Norte" }, { nombre: "Comedor Sur" }];
    comedorRepositoryMock.find_comedores.mockResolvedValue(comedores);

    const result = await comedorService.find_comedores();

    expect(comedorRepositoryMock.find_comedores).toHaveBeenCalled();
    expect(result).toEqual(comedores);
  });

  test("find_comedores debe lanzar error si no hay comedores", async () => {
    comedorRepositoryMock.find_comedores.mockResolvedValue([]);

    await expect(comedorService.find_comedores())
      .rejects
      .toThrow("No dining halls found in the database");
  });


  // --- FIND_COMEDORES_BY_IDS ---
  test("find_comedores_by_ids debe llamar correctamente al repositorio", async () => {
    const ids = ["1", "2"];
    const comedores = [{ id: "1" }, { id: "2" }];
    comedorRepositoryMock.find_comedores_by_ids.mockResolvedValue(comedores);

    const result = await comedorService.find_comedores_by_ids(ids);

    expect(comedorRepositoryMock.find_comedores_by_ids).toHaveBeenCalledWith(ids);
    expect(result).toEqual(comedores);
  });


  // --- FIND_COMEDORES_BY_NAME ---
  test("find_comedores_by_name debe buscar por nombre correctamente", async () => {
    const name = "Central";
    const comedores = [{ nombre: "Comedor Central" }];
    comedorRepositoryMock.find_comedores_by_name.mockResolvedValue(comedores);

    const result = await comedorService.find_comedores_by_name(name);

    expect(comedorRepositoryMock.find_comedores_by_name).toHaveBeenCalledWith(name);
    expect(result).toEqual(comedores);
  });

  test("find_comedores_by_name debe lanzar error si no se pasa nombre", async () => {
    await expect(comedorService.find_comedores_by_name(""))
      .rejects
      .toThrow("The field 'name' is required");
  });
});
