import { ManagerController } from "../../Controller/ManagerController.js";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("ManagerController", () => {
  let managerServiceMock;
  let managerController;
  let req;
  let res;

  beforeEach(() => {
    managerServiceMock = {
      find_by_identification: jest.fn(),
      create_manager: jest.fn(),
      add_fields: jest.fn(),
      login_manager: jest.fn(),
    };

    managerController = new ManagerController(managerServiceMock);

    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // --- TEST 1: find_by_identification ---
  test("find_by_identification debe devolver 200 y el manager encontrado", async () => {
    req.query.identificacion = "123";
    const mockManager = { name: "Juan", identificacion: "123" };
    managerServiceMock.find_by_identification.mockResolvedValue(mockManager);

    await managerController.find_by_identification(req, res);

    expect(managerServiceMock.find_by_identification).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockManager);
  });

  test("find_by_identification debe manejar errores con status 404", async () => {
    req.query.identificacion = "999";
    managerServiceMock.find_by_identification.mockRejectedValue(new Error("Manager not found"));

    await managerController.find_by_identification(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Manager not found" });
  });



  // --- TEST 2: create_manager ---
  test("create_manager debe devolver 200 y mensaje de éxito", async () => {
    req.body = { name: "Carlos" };
    const mockResult = { id: 1, name: "Carlos" };
    managerServiceMock.create_manager.mockResolvedValue(mockResult);

    await managerController.create_manager(req, res);

    expect(managerServiceMock.create_manager).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Manager successfully created",
      result: mockResult,
    });
  });

  test("create_manager debe manejar errores con status 500", async () => {
    managerServiceMock.create_manager.mockRejectedValue(new Error("DB error"));

    await managerController.create_manager(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });



  // --- TEST 3: add_fields ---
  test("add_fields debe devolver 200 y mensaje de éxito", async () => {
    req.body = { identificacion: "123", newField: "value" };
    const mockUpdated = { identificacion: "123", newField: "value" };
    managerServiceMock.add_fields.mockResolvedValue(mockUpdated);

    await managerController.add_fields(req, res);

    expect(managerServiceMock.add_fields).toHaveBeenCalledWith("123", req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Fields updated successfully",
      updated: mockUpdated,
    });
  });

  test("add_fields debe manejar errores con status 404", async () => {
    managerServiceMock.add_fields.mockRejectedValue(new Error("Manager not found"));

    await managerController.add_fields(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Manager not found" });
  });

  

  // --- TEST 4: login_manager ---
  test("login_manager debe devolver 200 y los datos del login", async () => {
    req.body = { user: "admin", password: "1234" };
    const mockResponse = { token: "abc123" };
    managerServiceMock.login_manager.mockResolvedValue(mockResponse);

    await managerController.login_manager(req, res);

    expect(managerServiceMock.login_manager).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  test("login_manager debe manejar errores con status 401", async () => {
    managerServiceMock.login_manager.mockRejectedValue(new Error("Invalid credentials"));

    await managerController.login_manager(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});
