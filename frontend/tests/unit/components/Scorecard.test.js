import Scorecard from "@/components/Scorecard";
import { Scorecard as ScorecardModel } from "@/models/scorecard";
import { Player } from "@/models/player";
import { Score } from "@/models/score";
import { re, kontra } from "@/models/parties";
import { mount } from "@vue/test-utils";
import VueTestUtils from "@vue/test-utils";

VueTestUtils.config.mocks["$t"] = () => {};

let players;
let score;
let scorecard;

function stubScoreHumanPlayerWins() {
  players[0].points = () => 120;
  players[1].points = () => 120;
  const stubbedScore = new Score(players);
  stubbedScore.winner = () => [players[0], players[2]];
  return stubbedScore;
}

function stubPlayer(name, party, points) {
  const stubbedPlayer = new Player(name);
  stubbedPlayer.isRe = () => party === re;
  stubbedPlayer.isKontra = () => party !== re;
  stubbedPlayer.points = () => points;
  return stubbedPlayer;
}

beforeEach(() => {
  players = [
    stubPlayer("Player 1", re, 60),
    stubPlayer("Player 2", re, 59),
    stubPlayer("Player 3", kontra, 60),
    stubPlayer("Player 4", kontra, 61)
  ];

  scorecard = new ScorecardModel(players);
  score = new Score();
  score.evaluate(players);
});

describe("Scorecard.vue", () => {
  it("should display scorecard", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });

    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("should display next round button", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });

    expect(wrapper.find("button.next-round").exists()).toBe(true);
  });

  test("should emit next round event if next round button is clicked", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });
    wrapper.find("button.next-round").trigger("click");

    expect(wrapper.emitted().nextRound).toHaveLength(1);
  });

  it("should show 'you won' message when player won", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: stubScoreHumanPlayerWins()
      }
    });

    expect(wrapper.find("h1.message").text()).toContain("Yay, you win!");
  });

  it("should show 'you lose' message when player lost", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });

    expect(wrapper.find("h1.message").text()).toContain("You lose");
  });

  it("should make last scoreline bold", () => {
    scorecard.addScore([players[0], players[1]], 2);
    scorecard.addScore([players[1], players[3]], 4);

    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });

    const scorelines = wrapper.findAll(".scoreLine");
    expect(scorelines).toHaveLength(2);
    expect(scorelines.at(0).classes("bold")).toBe(false);
    expect(scorelines.at(1).classes("bold")).toBe(true);
  });

  it("should show extras list", () => {
    const wrapper = mount(Scorecard, {
      propsData: {
        scorecard: scorecard,
        players: players,
        currentScore: score
      }
    });

    const kontraExtras = wrapper.find(".extras.kontra");
    expect(wrapper.find(".extras.re").exists()).toBe(true);
    expect(kontraExtras.exists()).toBe(true);
    expect(kontraExtras.findAll("li")).toHaveLength(2);
    expect(kontraExtras.text()).toContain("win");
  });
});
