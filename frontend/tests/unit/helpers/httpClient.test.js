import { HttpClient } from "@/helpers/httpClient";
import fetchMock from "fetch-mock";

const http = new HttpClient();

beforeEach(() => {
  fetchMock.reset();
});

describe("HTTP Client", () => {
  test("should load base url from config", () => {
    expect(http.baseUrl).toEqual("http://localhost:5000");
  });

  test("should perform get request", async () => {
    fetchMock.get("http://localhost:5000/api", 200);
    const response = await http.get("/api");
    expect(response.status).toEqual(200);
  });

  test("should perform post request", async () => {
    fetchMock.post("http://localhost:5000/api", { some: "data" });
    const response = await http.post("/api", { input: "data" });
    const responseBody = await response.json();
    expect(response.status).toEqual(200);
    expect(responseBody).toEqual({ some: "data" });
  });
});
