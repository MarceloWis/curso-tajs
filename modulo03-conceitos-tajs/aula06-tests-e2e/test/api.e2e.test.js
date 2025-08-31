import {
  describe,
  beforeEach,
  beforeAll,
  it,
  expect,
  jest,
  afterAll,
} from "@jest/globals";

async function awaiForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

describe("E2E Teste Suite", () => {
  describe("E2E Test for Server in a non-test env", () => {
    it("should start server with PORT 4000", async () => {
      const PORT = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT;
      jest.spyOn(console, console.log.name);

      const { default: server } = await import("../src/index.js");
      await awaiForServerStatus(server);
      const serverInfo = server.address();

      expect(serverInfo.port).toBe(4000);
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}:${serverInfo.port}`
      );
      return new Promise((resolve) => server.close(resolve));
    });
  });
  describe("E2E Teste for Server", () => {
    let _testServer;
    let _testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();
      await awaiForServerStatus(_testServer);
      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    afterAll((done) => _testServer.close(done));

    it("should return 404 for unsupported routes", async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`, {
        method: "POST",
      });

      expect(response.status).toBe(404);
    });
    it("should return 400 and missing field message when body is invalid", async () => {
      const invalidPerson = { name: "Marcelo Wis" };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("cpf is required");
    });
    it("should return 400 and missing field message when body is invalid", async () => {
      const invalidPerson = { cpf: "123.456.789-00" };
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("name is required");
    });
  });
});
