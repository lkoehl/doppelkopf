import App from "@/App";
import { Game } from "@/models/game";
import { mount } from "@vue/test-utils";
import VueTestUtils from "@vue/test-utils";

VueTestUtils.config.mocks["$t"] = msg => msg;
VueTestUtils.config.mocks["$tc"] = msg => msg;
VueTestUtils.config.mocks["$i18n"] = { locale: "en" };

describe("App.vue", () => {
  test("should render Welcome Screen for new game", () => {
    const wrapper = mount(App, { propsData: { game: new Game() } });
    expect(wrapper.find(".welcome").exists()).toBe(true);
    expect(wrapper.find(".table").exists()).toBe(false);
  });

  test("should render Table if game is started", () => {
    const startedGame = new Game();
    startedGame.start();

    const wrapper = mount(App, { propsData: { game: startedGame } });

    expect(wrapper.find(".table").exists()).toBe(true);
    expect(wrapper.find(".welcome").exists()).toBe(false);
  });
});
