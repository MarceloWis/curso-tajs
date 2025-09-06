import {
  describe,
  beforeEach,
  beforeAll,
  it,
  expect,
  jest,
  afterAll,
} from "@jest/globals";
import { server } from "../src/api";

/**
 - Deve cadastrar usuarios e definir uma categoria onde:
  - Jovens Adultos:
    - Usuarios de 18-25
  - Adultos:
    - Usuarios de 26-50
  - Idosos:
    - 51+
  - Menor
    - Estoura um erro!
 */
describe("API Users E2E Suite", () => {
  let _testServer;
  let _testServerAddress;

  async function awaiForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => reject(err));
      server.once("listening", () => resolve());
    });
  }

  async function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async function findUserById(id) {
    return fetch(`${_testServerAddress}/users/${id}`);
  }

  beforeAll(async () => {
    jest.useFakeTimers({
      now: new Date("2023-10-23T00:00"),
    });
    process.env.NODE_ENV = "test";
    const { server } = await import("../src/api.js");
    _testServer = server.listen();
    await awaiForServerStatus(_testServer);
    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
    jest.useRealTimers();
  });

  afterAll((done) => {
    server.closeAllConnections();
    _testServer.close(done);
  });
  it("should register a new user with toung-adult category", async () => {
    const expectedCategory = "young-adult";
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2004-01-01",
    });
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.id).not.toBeUndefined();

    const user = await findUserById(result.id);
    const userResponse = await user.json();
    expect(userResponse.category).toBe(expectedCategory);
  });
  it.todo("should register a new user with adult category");
  it.todo("should register a new user with senior category");
  it("should throw an error when registering a under-age user", async () => {
    const response = await createUser({
      name: "Xuxa da Silva",
      birthDay: "2018-01-01",
    });
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({ message: "User must be 18yo or older" });
  });
});
