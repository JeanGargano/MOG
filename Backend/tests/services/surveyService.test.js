import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { SurveyService } from "../../Service/SurveyService.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fs from "fs";
import ExcelJS from "exceljs";

describe("SurveyService", () => {
  let surveyService;
  let surveyRepositoryMock;
  let mock;

  beforeEach(() => {
    // Mock de axios usando axios-mock-adapter
    mock = new MockAdapter(axios);

    surveyRepositoryMock = {
      create_survey: jest.fn(),
      find_all: jest.fn(),
    };

    surveyService = new SurveyService(surveyRepositoryMock);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  test("get_form retorna formulario si axios responde correctamente", async () => {
    const fakeResponse = { name: "Formulario A" };
    const formId = "123";
    
    // El servicio llama a Google Apps Script, no a jotform
    const url = "https://script.google.com/macros/s/AKfycbwN76byYy3cpuzT64hKAw_YbrU51Pt5D6F8wpfslYYen-CPD6G5W9vx3OhgFIHXHvA0KA/exec";
    
    mock.onGet(url).reply(200, fakeResponse);

    const result = await surveyService.get_form(formId);
    expect(result).toEqual(fakeResponse);
  });

  test("get_form maneja error de axios", async () => {
    const formId = "123";
    const url = "https://script.google.com/macros/s/AKfycbwN76byYy3cpuzT64hKAw_YbrU51Pt5D6F8wpfslYYen-CPD6G5W9vx3OhgFIHXHvA0KA/exec";
    
    mock.onGet(url).reply(500);

    const result = await surveyService.get_form(formId);
    expect(result.error).toBeDefined();
    expect(result.error).toBe("Could not retrieve form");
  });

  test("migrate_surveys guarda encuestas y retorna conteo", async () => {
    const fakeSurveys = [
      { 
        name: "Survey 1", 
        form_id: "form1",
        completions: []
      },
      { 
        name: "Survey 2", 
        form_id: "form2",
        completions: []
      }
    ];

    surveyRepositoryMock.create_survey
      .mockResolvedValueOnce({ id: "1", ...fakeSurveys[0] })
      .mockResolvedValueOnce({ id: "2", ...fakeSurveys[1] });

    const result = await surveyService.migrate_surveys(fakeSurveys);

    // El servicio retorna un objeto con status, message y count
    expect(result).toEqual({
      status: 200,
      message: "Migration completed",
      count: 2
    });
    expect(surveyRepositoryMock.create_survey).toHaveBeenCalledTimes(2);
  });

  test("migrate_surveys lanza error si no hay encuestas", async () => {
    await expect(surveyService.migrate_surveys([])).rejects.toThrow("No surveys to migrate");
  });

  test("convert_to_excel genera archivo Excel", async () => {
    const surveys = [
      {
        id: "1",
        name: "Survey Test",
        form_id: "form123",
        completions: [
          {
            manager_id: "mgr1",
            canteen_id: "cant1",
            respondents: [
              {
                fullName: "Juan Pérez",
                completionDate: "2024-01-01",
                questions: [
                  { question: "¿Calidad?", answer: "Excelente" }
                ]
              }
            ]
          }
        ]
      }
    ];

    // Mock del workbook
    const mockWorksheet = {
      columns: [],
      addRow: jest.fn(),
    };

    const mockWorkbook = {
      addWorksheet: jest.fn().mockReturnValue(mockWorksheet),
      xlsx: {
        writeFile: jest.fn().mockResolvedValue(undefined),
      },
    };

    // Spy en ExcelJS.Workbook
    const WorkbookSpy = jest.spyOn(ExcelJS, 'Workbook')
      .mockImplementation(() => mockWorkbook);

    // Mock de fs
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

    const filename = await surveyService.convert_to_excel(surveys);

    // El servicio genera un archivo con nombre "survey.xlsx" por defecto
    expect(filename).toContain("survey.xlsx");
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith("Survey");
    expect(mockWorksheet.addRow).toHaveBeenCalled();
    expect(mockWorkbook.xlsx.writeFile).toHaveBeenCalled();

    // Limpiar
    WorkbookSpy.mockRestore();
    existsSyncSpy.mockRestore();
    mkdirSyncSpy.mockRestore();
  });

  test("convert_to_excel usa nombre de archivo personalizado", async () => {
    const surveys = [
      {
        id: "1",
        name: "Survey Test",
        form_id: "form123",
        completions: []
      }
    ];

    const mockWorksheet = {
      columns: [],
      addRow: jest.fn(),
    };

    const mockWorkbook = {
      addWorksheet: jest.fn().mockReturnValue(mockWorksheet),
      xlsx: {
        writeFile: jest.fn().mockResolvedValue(undefined),
      },
    };

    const WorkbookSpy = jest.spyOn(ExcelJS, 'Workbook')
      .mockImplementation(() => mockWorkbook);

    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const customName = "mi_reporte_2024";
    const filename = await surveyService.convert_to_excel(surveys, customName);

    expect(filename).toContain(customName);
    expect(filename).toContain(".xlsx");

    WorkbookSpy.mockRestore();
    existsSyncSpy.mockRestore();
  });
});