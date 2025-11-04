import { ManagerService } from "../../service/ManagerService.js";
import bcrypt from "bcrypt";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("ManagerService", () => {
  let managerRepository;
  let service;

  beforeEach(() => {
    managerRepository = {
      find_by_identification: jest.fn(),
      create_manager: jest.fn(),
      add_fields: jest.fn(),
    };
    service = new ManagerService(managerRepository);
  });

  
  // --- TEST 1: find_by_identification ---
  test("Debe devolver manager si la identificación es válida", async () => {
    const fakeManager = { identificacion: 1, nombreCompleto: "Jean" };
    managerRepository.find_by_identification.mockResolvedValue(fakeManager);

    const result = await service.find_by_identification(1);
    expect(result).toEqual(fakeManager);
  });


  test("Debe lanzar error si manager no existe", async () => {
    managerRepository.find_by_identification.mockResolvedValue(null);
    await expect(service.find_by_identification(99))
      .rejects.toThrow("Manager not found");
  });

  
  // --- TEST 2: create_manager ---
  test("Debe crear manager si los datos son válidos", async () => {
    const data = { identificacion: 10, nombreCompleto: "Jean" };
    managerRepository.find_by_identification.mockResolvedValue(null);
    managerRepository.create_manager.mockResolvedValue(data);

    const result = await service.create_manager(data);
    expect(result).toEqual(data);
  });


  test("Debe lanzar error si ya existe manager", async () => {
    managerRepository.find_by_identification.mockResolvedValue({ id: 10 });
    await expect(
      service.create_manager({ identificacion: 10, nombreCompleto: "Jean" })
    ).rejects.toThrow("already exists");
  });

 

  // --- TEST 3: add_fields ---
  test("Debe encriptar password y actualizar campos", async () => {
    const data = { password: "securePass" };
    managerRepository.add_fields.mockResolvedValue({ success: true });

    const result = await service.add_fields(1, data);
    expect(result).toEqual({ success: true });
    expect(managerRepository.add_fields).toHaveBeenCalled();
    expect(await bcrypt.compare("securePass", data.password)).toBe(true);
  });


    // --- TEST 4: login_manager ---
  test("Debe autenticar correctamente si password coincide", async () => {
    const hashed = await bcrypt.hash("1234", 10);
    const manager = { identificacion: 1, password: hashed };
    managerRepository.find_by_identification.mockResolvedValue(manager);

    const result = await service.login_manager({ identificacion: 1, password: "1234" });
    expect(result.message).toBe("Login successful");
  });

  test("Debe fallar si password incorrecta", async () => {
    const hashed = await bcrypt.hash("1234", 10);
    const manager = { identificacion: 1, password: hashed };
    managerRepository.find_by_identification.mockResolvedValue(manager);

    await expect(
      service.login_manager({ identificacion: 1, password: "bad" })
    ).rejects.toThrow("Incorrect password");
  });
});
