import { Telemetry } from "@/models/telemetry";
import fetchMock from "fetch-mock";

beforeEach(() => {
  fetchMock.reset();
});

test("should send new game event", async () => {
  fetchMock.post("http://localhost:5000/api/game/new", { id: 1234 });
  await Telemetry.newGame();
  expect(fetchMock.called()).toBe(true);
});

test("should store gameId", async () => {
  fetchMock.post("http://localhost:5000/api/game/new", { id: 1234 });
  await Telemetry.newGame();
  expect(Telemetry.gameId).toEqual(1234);
});

test("should set gameId as undefined if sending new game event fails", async () => {
  fetchMock.post("http://localhost:5000/api/game/new", 500);
  await Telemetry.newGame();
  expect(Telemetry.gameId).toBeUndefined();
});

test("should send win event", async () => {
  Telemetry.gameId = 1234;
  fetchMock.post("http://localhost:5000/api/game/win", 200);
  await Telemetry.win();
  expect(fetchMock.called()).toBe(true);
});
