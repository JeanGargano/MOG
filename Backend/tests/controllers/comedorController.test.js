import { ComedorController } from "../../controller/ComedorController.js";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("ComedorController", () => {
  let comedorServiceMock;
  let comedorController;
  let req, res;

  beforeEach(() => {
    comedorServiceMock = {
      post_comedor: jest.fn(),
      find_comedores: jest.fn(),
      find_comedores_by_ids: jest.fn(),
      find_comedores_by_name: jest.fn(),
    };

    comedorController = new ComedorController(comedorServiceMock);

    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });



  // --- TEST 1: POST_COMEDOR ---
  test("post_comedor debe crear un comedor exitosamente", async () => {
    const fakeComedor = { nombre: "Comedor Central" };
    comedorServiceMock.post_comedor.mockResolvedValue(fakeComedor);
    req.body = fakeComedor;

    await comedorController.post_comedor(req, res);

    expect(comedorServiceMock.post_comedor).toHaveBeenCalledWith(fakeComedor);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dining hall created successfully",
      comedor: fakeComedor,
    });
  });

  test("post_comedor debe manejar error del servicio", async () => {
    comedorServiceMock.post_comedor.mockRejectedValue(new Error("Error al crear"));
    req.body = {};

    await comedorController.post_comedor(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error al crear" });
  });



  // --- TEST 2: FIND_COMEDORES ---
  test("find_comedores debe devolver una lista de comedores", async () => {
    const comedores = [
      { nombre: "Comedor Norte" },
      { nombre: "Comedor Sur" },
    ];
    comedorServiceMock.find_comedores.mockResolvedValue(comedores);

    await comedorController.find_comedores(req, res);

    expect(comedorServiceMock.find_comedores).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comedores);
  });

  test("find_comedores debe manejar error", async () => {
    comedorServiceMock.find_comedores.mockRejectedValue(new Error("Fallo al buscar"));

    await comedorController.find_comedores(req, res);

    // El controller real devuelve 404, no 400
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Fallo al buscar" });
  });



  // ---TEST 3: FIND_COMEDORES_BY_IDS ---
  test("find_comedores_by_ids debe devolver comedores por ID", async () => {
    const ids = ["1", "2"];
    const comedores = [{ id: "1" }, { id: "2" }];
    comedorServiceMock.find_comedores_by_ids.mockResolvedValue(comedores);
    // El controller espera ids en req.body, no en req.query
    req.body = { ids };

    await comedorController.find_comedores_by_ids(req, res);

    expect(comedorServiceMock.find_comedores_by_ids).toHaveBeenCalledWith(ids);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comedores);
  });

  test("find_comedores_by_ids debe manejar ids inválidos", async () => {
    // Test cuando no se envían ids
    req.body = { ids: [] };

    await comedorController.find_comedores_by_ids(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "An array of IDs is required" });
  });

  test("find_comedores_by_ids debe manejar error del servicio", async () => {
    comedorServiceMock.find_comedores_by_ids.mockRejectedValue(new Error("Error IDs"));
    req.body = { ids: ["1", "2"] };

    await comedorController.find_comedores_by_ids(req, res);

    // El controller real devuelve 500, no 400
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error IDs" });
  });



  // --- TEST 4: FIND_COMEDORES_BY_NAME ---
  test("find_comedores_by_name debe devolver comedores por nombre", async () => {
    const nombre = "Central";
    const comedores = [{ nombre: "Comedor Central" }];
    comedorServiceMock.find_comedores_by_name.mockResolvedValue(comedores);
    // El controller espera nombre en req.body, no en req.query
    req.body = { nombre };

    await comedorController.find_comedores_by_name(req, res);

    expect(comedorServiceMock.find_comedores_by_name).toHaveBeenCalledWith(nombre);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comedores);
  });

  test("find_comedores_by_name debe validar campo nombre requerido", async () => {
    // Test cuando no se envía nombre
    req.body = {};

    await comedorController.find_comedores_by_name(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "The field 'name' is required" });
  });

  test("find_comedores_by_name debe manejar error del servicio", async () => {
    comedorServiceMock.find_comedores_by_name.mockRejectedValue(new Error("Error búsqueda"));
    req.body = { nombre: "Central" };

    await comedorController.find_comedores_by_name(req, res);

    // El controller real devuelve 500, no 400
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error búsqueda" });
  });
});