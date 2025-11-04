import { SurveyController } from "../../controller/SurveyController.js";
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("SurveyController", () => {
  let surveyServiceMock;
  let surveyController;
  let req, res;

  beforeEach(() => {
    surveyServiceMock = {
      get_form: jest.fn(),
      migrate_surveys: jest.fn(),
    };
    surveyController = new SurveyController(surveyServiceMock);

    req = { query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });


  // --- TEST 1: GET_FORM ---
  test("get_form debe retornar 400 si falta el ID", async () => {
    await surveyController.get_form(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing form ID parameter" });
  });

  test("get_form debe retornar 200 si se obtiene formulario válido", async () => {
    req.query.id = "123";
    const fakeForm = { name: "Encuesta de prueba" };
    surveyServiceMock.get_form.mockResolvedValue(fakeForm);

    await surveyController.get_form(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeForm);
  });


  // --- TEST 2: MIGRATE_SURVEYS ---
  test("migrate_surveys debe retornar 400 si el cuerpo está vacío", async () => {
    req.body = {};
    await surveyController.migrate_surveys(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("migrate_surveys debe llamar al servicio y retornar 200", async () => {
    const fakeResponse = { status: 200, message: "Migration completed" };
    surveyServiceMock.migrate_surveys.mockResolvedValue(fakeResponse);
    req.body = [{ name: "Test survey" }];

    await surveyController.migrate_surveys(req, res);
    expect(surveyServiceMock.migrate_surveys).toHaveBeenCalled();
  });
});
